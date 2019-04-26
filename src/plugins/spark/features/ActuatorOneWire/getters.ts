import { blockById } from '@/plugins/spark/store/getters';
import { RootStore } from '@/store/state';
import { ActuatorOneWireBlock } from './state';

export const typeName = 'ActuatorOneWire';

export const channel = [
  'Unset',
  'A',
  'B',
];

export const getById =
  (store: RootStore, serviceId: string, id: string): ActuatorOneWireBlock =>
    blockById<ActuatorOneWireBlock>(store, serviceId, id, typeName);
