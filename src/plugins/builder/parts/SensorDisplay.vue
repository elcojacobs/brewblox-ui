<script lang="ts">
import get from 'lodash/get';
import { Component } from 'vue-property-decorator';

import { Block } from '@/plugins/spark/types';

import PartBase from '../components/PartBase';
import { settingsBlock } from '../helpers';


@Component
export default class SensorDisplay extends PartBase {
  get block(): Block | null {
    return settingsBlock(this.part, 'sensor');
  }

  get temperature(): number | null {
    return get(this, 'block.data.value.val', null);
  }

  get tempUnit(): string {
    return get(this, 'block.data.value.notation', '');
  }
}
</script>

<template>
  <g>
    <foreignObject :transform="textTransformation([1,1])" :width="squares(1)" :height="squares(1)">
      <div class="text-white text-bold text-center">
        <q-icon name="mdi-thermometer" />
        <q-icon v-if="!block" name="mdi-link-variant-off" />
        <small v-else>{{ tempUnit }}</small>
        <br />
        {{ temperature | round(1) }}
      </div>
    </foreignObject>
    <g class="outline">
      <rect
        :width="squares(1)-2"
        :height="squares(1)-2"
        x="1"
        y="1"
        rx="6"
        ry="6"
        stroke-width="2px"
      />
    </g>
  </g>
</template>
