import { ref } from '@/helpers/component-ref';
import { Unit } from '@/helpers/units';
import GenericBlock from '@/plugins/spark/components/GenericBlock';
import { Feature } from '@/store/features';

import { BlockSpec } from '../../types';
import { typeName } from './getters';
import form from './TempSensorMockForm.vue';
import widget from './TempSensorMockWidget.vue';
import { TempSensorMockData } from './types';

const block: BlockSpec = {
  id: typeName,
  generate: (): TempSensorMockData => ({
    value: new Unit(20, 'degC'),
    connected: true,
  }),
  changes: [
    {
      key: 'value',
      title: 'Sensor Value',
      component: 'UnitValEdit',
      generate: () => new Unit(20, 'degC'),
    },
    {
      key: 'connected',
      title: 'Connected',
      component: 'BoolValEdit',
      generate: () => true,
    },
  ],
  presets: [],
  graphTargets: {
    value: 'Sensor value',
  },
};

const feature: Feature = {
  ...GenericBlock,
  id: typeName,
  displayName: 'Temp Sensor (Mock)',
  role: 'Process',
  widget: ref(widget),
  form: ref(form),
  widgetSize: {
    cols: 4,
    rows: 2,
  },
};

export default { feature, block };
