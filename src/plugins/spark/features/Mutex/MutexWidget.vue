<script lang="ts">
import { Component } from 'vue-property-decorator';

import BlockWidget from '@/plugins/spark/components/BlockWidget';

import { getMutexClients, MutexBlocks } from './getters';
import { MutexBlock } from './types';

@Component
export default class MutexWidget extends BlockWidget {
  readonly block!: MutexBlock;

  get mutexClients(): MutexBlocks {
    return getMutexClients(this.serviceId, this.blockId);
  }
}
</script>

<template>
  <q-card dark class="text-white scroll">
    <BlockWidgetToolbar :crud="crud" />

    <q-card-section>
      <q-item dark class="align-children">
        <q-item-section>
          <q-item-label caption>
            Held by
          </q-item-label>
          <div v-for="client in mutexClients.active" :key="client">
            {{ client }}
          </div>
          <div v-if="mutexClients.active.length === 0">
            --
          </div>
        </q-item-section>
        <q-item-section>
          <div>
            <q-item-label caption>
              Waiting
            </q-item-label>
            <div v-for="client in mutexClients.waiting" :key="client">
              {{ client }}
            </div>
            <div v-if="mutexClients.waiting.length === 0">
              --
            </div>
          </div>
          <div class="q-mt-md">
            <q-item-label caption>
              Wait time remaining
            </q-item-label>
            <div
              v-if="mutexClients.waiting.length > 0 && block.data.waitRemaining.value"
            >
              {{ block.data.waitRemaining | unitDuration }}
            </div>
            <div v-else>
              --
            </div>
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label caption>
            Idle
          </q-item-label>
          <div v-for="client in mutexClients.idle" :key="client">
            {{ client }}
          </div>
          <div v-if="mutexClients.idle.length === 0">
            --
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
