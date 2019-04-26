<script lang="ts">
import BlockWidget from '@/plugins/spark/components/BlockWidget';
import Component from 'vue-class-component';
import { getById } from './getters';
import { DS2413Block } from './state';

@Component
export default class DS2413Widget extends BlockWidget {
  get block(): DS2413Block {
    return getById(this.$store, this.serviceId, this.blockId);
  }

  get address() {
    return this.block.data.address;
  }

  get latchA() {
    return this.block.data.latches & 1;
  }

  get latchB() {
    return this.block.data.latches & 2;
  }

  get pinA() {
    return this.block.data.pins & 1;
  }

  get pinB() {
    return this.block.data.pins & 2;
  }
}
</script>

<template>
  <q-card dark class="text-white scroll">
    <q-dialog v-model="modalOpen" no-backdrop-dismiss>
      <DS2413Form v-if="modalOpen" v-bind="formProps"/>
    </q-dialog>

    <BlockWidgetToolbar :field="me"/>

    <q-card-section>
      <q-item dark>
        <q-item-section style="justify-content: flex-start">
          <q-item-label caption>Latches</q-item-label>
          <div>
            <q-toggle :value="latchA" class="col-6" readonly label="Latch A"/>
            <q-toggle :value="latchB" class="col-6" readonly label="Latch B"/>
          </div>
          <DrivenIndicator :block-id="block.id" :service-id="serviceId"/>
        </q-item-section>
        <q-item-section style="justify-content: flex-start">
          <q-item-label caption>Sensing</q-item-label>
          <div>
            <q-toggle :value="pinA" class="col-6" readonly label="Sense A"/>
            <q-toggle :value="pinB" class="col-6" readonly label="Sense B"/>
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
