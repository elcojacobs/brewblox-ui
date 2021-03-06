<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { clampRotation, spaceCased } from '@/helpers/functional';

import { SQUARE_SIZE } from './getters';
import { builderStore } from './store';
import { CardSpec, FlowPart } from './types';

@Component
export default class BuilderPartMenu extends Vue {
  specs = builderStore.specs;

  @Prop({ type: Object, required: true })
  readonly part!: FlowPart;

  get cards(): CardSpec[] {
    return [
      { component: 'PlacementCard' },
      ...this.specs[this.part.type].cards,
    ];
  }

  get partTitle(): string {
    return `${spaceCased(this.part.type)} ${this.part.x},${this.part.y}`;
  }


  get rotatedSize(): [number, number] {
    const [x, y] = this.part.size;
    return clampRotation(this.part.rotate) % 180
      ? [y, x]
      : [x, y];
  }

  get displayScale(): number {
    const maxSize = Math.max(...this.part.size);
    if (maxSize >= 6) {
      return 0.5;
    }
    if (maxSize >= 4) {
      return 1;
    }
    return 2;
  }

  squares(val: number): number {
    return SQUARE_SIZE * val;
  }
}
</script>

<template>
  <q-card dark class="widget-modal">
    <DialogToolbar>{{ partTitle }}</DialogToolbar>

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <svg
            :width="`${squares(rotatedSize[0]) * displayScale}px`"
            :height="`${squares(rotatedSize[1] * displayScale)}px`"
            :viewBox="`0, 0, ${squares(rotatedSize[0])}, ${squares(rotatedSize[1])}`"
            class="q-mx-auto"
          >
            <PartWrapper :part="part" />
          </svg>
        </q-item-section>
      </q-item>
      <component
        :is="card.component"
        v-for="(card, idx) in cards"
        :key="idx"
        :part="part"
        v-bind="card.props || {}"
        v-on="$listeners"
      />
    </q-card-section>
  </q-card>
</template>
