import { genericBlockFeature } from '@/plugins/spark/generic';
import { blockWidgetSelector, prettifyConstraints } from '@/plugins/spark/helpers';
import {
  ActuatorOffsetBlock,
  AnalogConstraintsObj,
  BlockIntfType,
  BlockSpec,
  ReferenceKind,
} from '@/plugins/spark/types';
import { Link } from '@/plugins/spark/units';
import { WidgetFeature } from '@/store/features';

import widget from './ActuatorOffsetWidget.vue';

const typeName = 'ActuatorOffset';

const block: BlockSpec<ActuatorOffsetBlock> = {
  id: typeName,
  generate: () => ({
    targetId: new Link(null, BlockIntfType.SetpointSensorPairInterface),
    drivenTargetId: new Link(null, BlockIntfType.SetpointSensorPairInterface, true),
    referenceId: new Link(null, BlockIntfType.SetpointSensorPairInterface),
    referenceSettingOrValue: ReferenceKind.REF_SETTING,
    desiredSetting: 0,
    setting: 0,
    value: 0,
    constrainedBy: { constraints: [] },
    enabled: true,
  }),
  fields: [
    {
      key: 'desiredSetting',
      title: 'Target offset',
      component: 'NumberValEdit',
      generate: () => 0,
      valueHint: 'degC or %, depending on target',
    },
    {
      key: 'enabled',
      title: 'Enabled',
      component: 'BoolValEdit',
      generate: () => true,
    },
    {
      key: 'targetId',
      title: 'Target',
      component: 'LinkValEdit',
      generate: () => new Link(null, BlockIntfType.SetpointSensorPairInterface),
    },
    {
      key: 'referenceId',
      title: 'Reference',
      component: 'LinkValEdit',
      generate: () => new Link(null, BlockIntfType.SetpointSensorPairInterface),
    },
    {
      key: 'constrainedBy',
      title: 'Constraints',
      component: 'AnalogConstraintsValEdit',
      generate: (): AnalogConstraintsObj => ({ constraints: [] }),
      pretty: prettifyConstraints,
    },
    {
      key: 'setting',
      title: 'Target offset',
      component: 'NumberValEdit',
      generate: () => 0,
      valueHint: 'number',
      readonly: true,
      graphed: true,
    },
    {
      key: 'value',
      title: 'Actual offset',
      component: 'NumberValEdit',
      generate: () => 0,
      valueHint: 'number',
      readonly: true,
      graphed: true,
    },
  ],
};

const feature: WidgetFeature = {
  ...genericBlockFeature,
  id: typeName,
  title: 'Setpoint Driver',
  role: 'Output',
  component: blockWidgetSelector(widget, typeName),
  widgetSize: {
    cols: 4,
    rows: 3,
  },
};

export default { feature, block };
