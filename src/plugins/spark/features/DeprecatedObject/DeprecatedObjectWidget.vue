<script lang="ts">
import { Component } from 'vue-property-decorator';

import BlockWidget from '@/plugins/spark/components/BlockWidget';
import { sparkStore } from '@/plugins/spark/store';

import { fetchStoredBlock } from '../../store/api';
import { Block } from '../../types';
import { DeprecatedObjectBlock } from './types';

@Component
export default class DeprecatedObjectWidget extends BlockWidget {
  readonly block!: DeprecatedObjectBlock;
  actual: Block | null = null;

  async created(): Promise<void> {
    this.actual = await fetchStoredBlock(this.serviceId, this.block.data.actualId);
  }

  removeBlock(): void {
    sparkStore.removeBlock([this.block.serviceId, this.block]);
  }
}
</script>

<template>
  <q-card dark class="text-white scroll">
    <WidgetToolbar :title="widget.title" :subtitle="displayName" />

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <q-item-label caption>
            Id
          </q-item-label>
          {{ actual ? actual.id : 'Unknown' }}
        </q-item-section>
        <q-item-section>
          <q-item-label caption>
            Type
          </q-item-label>
          {{ actual ? actual.type : 'Unknown' }}
        </q-item-section>
        <q-item-section class="col-auto">
          <q-btn icon="delete" flat @click="removeBlock" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
