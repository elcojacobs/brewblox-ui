<script lang="ts">
import { Component } from 'vue-property-decorator';

import PartBase from '../components/PartBase';
import { RIGHT } from '../getters';

@Component
export default class StraightTube extends PartBase {
  readonly paths = {
    borders: [
      'M 0,21 H 50',
      'M 0,29 H 50',
    ],
    liquid: 'M 0,25 H 50',
  };

  get flowSpeed(): number {
    return this.flowOnCoord(RIGHT);
  }

  get liquids(): string[] {
    return this.liquidOnCoord(RIGHT);
  }
}
</script>

<template>
  <g>
    <g class="outline">
      <path :d="paths.borders[0]" />
      <path :d="paths.borders[1]" />
    </g>
    <LiquidStroke :paths="[paths.liquid]" :colors="liquids" />
    <AnimatedArrows :speed="flowSpeed" path="M0,25H50" />
  </g>
</template>
