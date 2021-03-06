<script lang="ts">
import get from 'lodash/get';
import { Component } from 'vue-property-decorator';

import { BEER, COLD_WATER, HOT_WATER, WORT } from '../getters';
import { colorString } from '../helpers';
import PartCard from './PartCard';

@Component
export default class LiquidSourceCard extends PartCard {
  presetColors = [
    COLD_WATER,
    HOT_WATER,
    BEER,
    WORT,
  ];

  get pressured(): boolean {
    return get(this.part.settings, 'enabled', !!this.part.settings.pressure);
  }

  set pressured(enabled: boolean) {
    this.savePart({ ...this.part, settings: { ...this.part.settings, enabled } });
  }

  get color(): string | null {
    return get(this.part.settings, ['liquids', 0], null);
  }

  set color(val: string | null) {
    const liquids = val ? [colorString(val)] : [];
    this.savePart({ ...this.part, settings: { ...this.part.settings, liquids } });
  }

  toggle(color: string): void {
    this.color = color !== this.color ? color : null;
  }
}
</script>

<template>
  <q-list dark>
    <q-separator dark />
    <q-item dark>
      <q-item-section>
        <q-item-label caption>
          Enabled
        </q-item-label>
        <q-toggle v-model="pressured" />
      </q-item-section>
      <q-item-section class="col-auto">
        <q-item-label caption>
          Liquid color
        </q-item-label>
        <ColorField
          v-model="color"
          clearable
          title="Liquid color"
          message="Choose a fill color for this source."
        />
      </q-item-section>
      <q-item-section v-for="colorOpt in presetColors" :key="colorOpt">
        <q-btn
          :style="`background-color: ${colorOpt}`"
          :size="color == colorOpt ? 'lg' : 'md'"
          round
          icon="format_color_fill"
          class="q-mx-auto"
          @click="toggle(colorOpt)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>
