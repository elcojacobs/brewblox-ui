import { genericBlockFeature } from '@/plugins/spark/generic';
import { useBlockSpecStore } from '@/plugins/spark/store';
import { BlockFieldSpec, BlockSpec } from '@/plugins/spark/types';
import { blockWidgetSelector } from '@/plugins/spark/utils/components';
import {
  enumHint,
} from '@/plugins/spark/utils/formatting';
import { useFeatureStore, WidgetFeature } from '@/store/features';
import { bloxLink } from '@/utils/link';
import {
  BlockIntfType,
  BlockType,
  DigitalInputBlock,
  DigitalState,
} from 'brewblox-proto/ts';
import { Plugin } from 'vue';
import widget from './DigitalInputWidget.vue';

const type = BlockType.DigitalInput;

const plugin: Plugin = {
  install(app) {
    const specStore = useBlockSpecStore();
    const featureStore = useFeatureStore();

    const blockSpec: BlockSpec<DigitalInputBlock> = {
      type,
      generate: (): DigitalInputBlock['data'] => ({
        hwDevice: bloxLink(null, BlockIntfType.IoArrayInterface),
        channel: 0,
        state: DigitalState.STATE_INACTIVE,
      }),
      analyze: (block: DigitalInputBlock) => {
        const { hwDevice, channel } = block.data;
        if (hwDevice.id == null || channel == 0) {
          return 'Invalid';
        }
        return 'Active';
      },
    };

    const fieldSpecs: BlockFieldSpec<DigitalInputBlock>[] = [
      {
        type,
        key: 'state',
        title: 'Actual state',
        component: 'StateValEdit',
        generate: (): DigitalState => DigitalState.STATE_INACTIVE,
        valueHint: enumHint(DigitalState),
        readonly: true,
        graphed: true,
      },
    ];

    const feature: WidgetFeature = {
      ...genericBlockFeature,
      id: type,
      title: 'Digital Input',
      role: 'Output',
      component: blockWidgetSelector(app, widget, type),
      widgetSize: {
        cols: 4,
        rows: 2,
      },
    };

    specStore.addBlockSpec(blockSpec);
    specStore.addFieldSpecs(fieldSpecs);
    featureStore.addWidgetFeature(feature);
  },
};

export default plugin;
