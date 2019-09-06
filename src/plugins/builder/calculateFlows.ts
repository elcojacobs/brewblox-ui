/**
 * IMPORTANT: this file is used by a web worker.
 * It can't import any modules with a dependency on a VueX store.
 * You'll notice it went wrong if your Webpack build fails with 0 errors.
 */

import get from 'lodash/get';
import has from 'lodash/has';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import set from 'lodash/set';

import { Coordinates } from '@/helpers/coordinates';

import { FlowSegment, PathLink } from './FlowSegment';
import { DEFAULT_FRICTION } from './getters';
import {
  CalculatedFlows,
  FlowPart,
  FlowRoute,
  LiquidFlow,
  StatePart,
  Transitions,
} from './types';

export const partCenter =
  (part: StatePart): [number, number, number] => {
    const [sizeX, sizeY] = part.size;
    return [sizeX / 2, sizeY / 2, 0];
  };

const adjacentPart = (
  allParts: FlowPart[],
  outCoords: string,
  currentPart: FlowPart | null = null,
): FlowPart | null =>
  allParts
    .find((part: FlowPart) =>
      !(currentPart && part.id === currentPart.id)
      && has(part, ['transitions', outCoords])) || null;

const normalizeFlows = (part: FlowPart): FlowPart => {
  if (!part.flows) {
    return { ...part, flows: {} };
  }

  const newFlows = mapKeys(part.flows,
    (flow, inCoord) =>
      new Coordinates(inCoord)
        .translate([-part.x, -part.y, 0])
        .flipShapeEdge(!!part.flipped, part.rotate, part.size)
        .toString()
  );

  return { ...part, flows: newFlows };
};

const translations = (part: StatePart): Transitions => {
  const result: Transitions = {};
  Object.entries(part.transitions).forEach(
    ([inCoordStr, transition]: [string, any]) => {
      // inCoords are relative from part anchor === [0, 0, 0]

      const updatedKey = new Coordinates(inCoordStr)
        .flipShapeEdge(!!part.flipped, 0, part.size)
        .translate([part.x, part.y, 0])
        .rotateShapeEdge(part.rotate, 0, part.size, [part.x, part.y, 0])
        .toString();

      const updatedTransition = transition
        .map((route: FlowRoute) => ({
          ...route,
          outCoords: new Coordinates(route.outCoords)
            .flipShapeEdge(!!part.flipped, 0, part.size)
            .translate([part.x, part.y, 0])
            .rotateShapeEdge(part.rotate, 0, part.size, [part.x, part.y, 0])
            .toString(),
        }));

      result[updatedKey] = updatedTransition;
    });
  return result;
};

export const asFlowParts = (parts: StatePart[]): FlowPart[] =>
  parts.map(part => ({ ...part, transitions: translations(part), flows: {} }));

const combineFlows =
  (left: CalculatedFlows = {}, right: CalculatedFlows = {}): CalculatedFlows => {
    const combined: CalculatedFlows = left;
    for (const coord in right) {
      for (const liquid in right[coord]) {
        set(combined, [coord, liquid], get(combined, [coord, liquid], 0) + right[coord][liquid]);
      }
    }
    return combined;
  };

const mergeFlows = (flows: CalculatedFlows): CalculatedFlows => {
  const mergedFlows: CalculatedFlows = {};
  Object.entries(flows)
    .forEach(([coord, coordFlows]: [string, LiquidFlow]) => {
      const splitPosNeg = (toSplit: LiquidFlow): [LiquidFlow, LiquidFlow, number, number] => {
        const positive = pickBy(toSplit, flow => flow >= 0);
        const negative = pickBy(toSplit, flow => flow < 0);
        const posTotal = Object.values(positive).reduce((sum, v) => sum + v, 0);
        const negTotal = Object.values(negative).reduce((sum, v) => sum + v, 0);
        return [positive, negative, posTotal, negTotal];
      };

      const scale = (unscaledFlows: LiquidFlow, factor: number): LiquidFlow => {
        const entries = Object.entries(unscaledFlows);
        const qty = entries.length;
        if (qty && entries.every(([, v]) => v === 0)) {
          return mapValues(unscaledFlows, () => factor / qty);
        }
        return mapValues(unscaledFlows, v => v * factor);
      };

      let toMerge = coordFlows;

      const [positive, negative, posTotal, negTotal] = splitPosNeg(toMerge);

      const total = posTotal + negTotal;
      // if flow exists in both directions, only keep the biggest and scale it down to the net flow
      if (posTotal !== 0 && negTotal !== 0) {
        toMerge = (posTotal >= -negTotal)
          ? scale(positive, total / posTotal)
          : scale(negative, total / negTotal);
      }

      // remove flows of zero if there is net flow
      if (total !== 0) {
        Object.entries(toMerge).forEach(([k, v]) => {
          if (v === 0) {
            delete toMerge[k];
          }
        });
      }

      if (toMerge) {
        mergedFlows[coord] = toMerge;
      }
    });
  return mergedFlows;
};
/*
  Find the part in allParts, and then merge the new flow into allParts.
*/
const additionalFlow = (
  part: FlowPart,
  allParts: FlowPart[],
  flowToAdd: CalculatedFlows,
): FlowPart[] =>
  allParts
    .map((item) =>
      part.id === item.id
        ? { ...item, flows: combineFlows(item.flows, flowToAdd) }
        : item);

export const flowPath = (
  parts: FlowPart[],
  start: FlowPart,
  inRoute: FlowRoute,
  startCoord: string = inRoute.outCoords): PathLink | null => {
  const inCoord = inRoute.outCoords;
  const outFlows: FlowRoute[] = get(start, ['transitions', inCoord], []);
  const path = new FlowSegment(start);

  if (outFlows.length === 0) {
    return null;
  }

  let candidateParts: FlowPart[] = parts.reduce((acc: FlowPart[], part: FlowPart) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [inCoord]: _, ...filteredTransitions } = part.transitions; // make a copy of transitions excluding inCoord

    if (inCoord !== startCoord) {
      Object.keys(filteredTransitions).forEach(k => {
        // filter out any transitions that go back to the inCoord to remove loops
        filteredTransitions[k] = filteredTransitions[k].filter(
          route => (route.outCoords != inCoord)
        );
      });
    }

    if (Object.getOwnPropertyNames(filteredTransitions).length !== 0) { // exclude parts without transitions
      acc.push({ ...part, transitions: filteredTransitions });
    }
    return acc;
  }, []);

  for (const outFlow of outFlows) {
    while (true) {
      const nextPart =
        (outFlow.sink || candidateParts.length === 0) ? null :
          outFlow.internal ? start : adjacentPart(candidateParts, outFlow.outCoords, start);

      let nextPath: PathLink | null = null;
      if (nextPart !== null) {
        nextPath = flowPath(candidateParts, nextPart, outFlow, startCoord);
        if (nextPath !== null) {
          path.addChild(nextPath);
        }
      }
      if (!nextPart || outFlow.internal) {
        break;
      }
      candidateParts = candidateParts
        .filter(part => nextPart && !(nextPart.id === part.id));
    }
  };

  if (path.next !== null) {
    // path was finished
    path.removeInternalFlows();
  }

  return { path, route: inRoute };
};

export const addFlowForPathLink = (
  parts: FlowPart[],
  link: PathLink,
  flows: LiquidFlow,
): FlowPart[] => {

  const inFlow: CalculatedFlows = {};
  const outFlow: CalculatedFlows = {};
  const splitFlow: CalculatedFlows = {};

  // add flow for incoming transition (if not source)
  if (!link.route.internal) {
    inFlow[link.route.outCoords] = mapValues(flows, v => -v);
  }

  // add flow for outgoing transition
  if (link.path.next) {
    outFlow[link.path.next.route.outCoords] = flows;
  }

  // divide flow for splits in between
  if (link.path.splits.length !== 0) {
    link.path.splits
      .forEach((child, idx) => {
        const scaledFlow = mapValues(flows, v => v * link.path.splitDivide[idx]);
        splitFlow[child.route.outCoords] = scaledFlow;
        parts = addFlowForPathLink(parts, child, scaledFlow);
      });
  }

  parts = additionalFlow(
    link.path.root,
    parts,
    {
      ...inFlow,
      ...outFlow,
      ...splitFlow,
    }
  );

  // continue path
  if (link.path.next) {
    parts = addFlowForPathLink(parts, link.path.next, flows);
  }

  return parts;
};

const addFlowFromPart = (parts: FlowPart[], part: FlowPart): FlowPart[] => {
  for (const inCoords in part.transitions) {
    const outFlows = part.transitions[inCoords] || [];
    for (const outFlow of outFlows) {
      const liquids: string[] = outFlow.liquids || [];
      if (outFlow.source && liquids.length > 0) {
        const pathLink = flowPath(parts, part, { outCoords: inCoords, internal: true });
        if (pathLink !== null) {
          const { friction, pressureDiff } = pathLink.path.friction({ pressureDiff: 0, friction: 0 });
          if (pressureDiff >= 0) {
            // only handle positive or zero flows
            // negative flows will have a positive counterpart we do handle
            const startFlow: LiquidFlow = {};
            liquids.forEach((liquid: string) => {
              const flow = pressureDiff / friction;
              startFlow[liquid] = flow;
            });
            parts = addFlowForPathLink(parts, pathLink, startFlow);
          }
        }
      }
    }
  }
  return parts;
};

// total flow is a superposition of all pressure sources in the system
// for each part, add the flow it adds to the global list of parts
// merge the flows afterwards
export const calculateFlows = (parts: FlowPart[]): FlowPart[] =>
  parts
    .reduce(addFlowFromPart, parts)
    .map(part => ({ ...part, flows: mergeFlows(part.flows) }));

// can be used to check whether a part has equal in and out flow
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const unbalancedFlow = (part: FlowPart): number =>
  Object.values(part.flows)
    .reduce((sum: number, v: LiquidFlow) =>
      Object.values(v)
        .reduce((sum2: number, w: number) => sum2 + w, sum),
      0);

export const calculateNormalizedFlows = (parts: StatePart[]): FlowPart[] =>
  calculateFlows(asFlowParts(parts)).map(normalizeFlows);
