import { showBlockDialog } from '@/helpers/dialog';
import { typeName } from '@/plugins/spark/features/Pid/getters';

import { settingsBlock } from '../helpers';
import { PartSpec, PersistentPart } from '../types';


const SIZE_X = 1;
const SIZE_Y = 1;

const spec: PartSpec = {
  id: 'PidDisplay',
  transitions: () => ({}),
  cards: [{
    component: 'LinkedBlockCard',
    props: { settingsKey: 'pid', types: [typeName], label: 'PID' },
  }],
  size: () => [SIZE_X, SIZE_Y],
  interactHandler: (part: PersistentPart) => showBlockDialog(settingsBlock(part, 'pid')),
};

export default spec;
