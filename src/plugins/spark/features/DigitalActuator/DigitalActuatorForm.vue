<script lang="ts">
import { Component } from 'vue-property-decorator';

import { Link } from '@/helpers/units';
import BlockCrudComponent from '@/plugins/spark/components/BlockCrudComponent';
import { sparkStore } from '@/plugins/spark/store';
import { Block } from '@/plugins/spark/types';

import { typeName } from './getters';
import { DigitalActuatorBlock } from './types';

@Component
export default class DigitalActuatorForm extends BlockCrudComponent {
  readonly block!: DigitalActuatorBlock;

  get hwBlock(): Block | null {
    const blockId = this.block.data.hwDevice.id;
    return !!blockId
      ? sparkStore.blockById(this.serviceId, blockId)
      : null;
  }

  get claimedChannels(): { [channel: number]: string } {
    if (!this.hwBlock) {
      return {};
    }
    const targetId = this.hwBlock.id;
    return sparkStore.blockValues(this.serviceId)
      .filter(block => block.type === typeName && block.data.hwDevice.id === targetId)
      .reduce((acc, block) => ({ ...acc, [block.data.channel]: block.id }), {});
  }

  pinOptName(idx: number): string {
    const driver = this.claimedChannels[idx + 1];
    const [name] = Object.keys((this.hwBlock as Block).data.pins[idx]);
    return driver && driver !== this.block.id
      ? `${name} (replace '${driver}')`
      : name;
  }

  get channelOpts(): SelectOption[] {
    const opts = [{ label: 'Not set', value: 0 }];
    if (this.hwBlock) {
      opts.push(
        ...Object.keys(this.hwBlock.data.pins || this.hwBlock.data.channels)
          .map((k, idx) => ({ label: this.pinOptName(idx), value: idx + 1 })));
    }
    return opts;
  }

  async claimChannel(pinId: number): Promise<void> {
    if (this.block.data.channel === pinId) {
      return;
    }
    const currentDriver = new Link(this.claimedChannels[pinId] || null, typeName);
    if (currentDriver.id) {
      const currentDriverBlock: DigitalActuatorBlock = sparkStore.blockById(this.serviceId, currentDriver.id);
      currentDriverBlock.data.channel = 0;
      await sparkStore.saveBlock([this.serviceId, currentDriverBlock]);
    }
    this.block.data.channel = pinId;
    await this.saveBlock();
  }
}
</script>

<template>
  <GraphCardWrapper>
    <template #graph>
      <HistoryGraph :id="widget.id" :config="graphCfg" />
    </template>

    <q-card dark class="widget-modal">
      <BlockFormToolbar :crud="crud" />

      <q-card-section>
        <q-item dark>
          <q-item-section>
            <q-item-label caption>
              Target Pin Array
            </q-item-label>
            <LinkField
              :value="block.data.hwDevice"
              :service-id="serviceId"
              title="Pin Array"
              no-create
              @input="v => { block.data.hwDevice = v; block.data.channel = 0; saveBlock(); }"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              Pin Channel
            </q-item-label>
            <SelectField
              :value="block.data.channel"
              :options="channelOpts"
              :readonly="!block.data.hwDevice.id"
              title="Pin Channel"
              @input="claimChannel"
            />
          </q-item-section>
        </q-item>
        <q-item dark>
          <q-item-section style="justify-content: flex-start">
            <q-item-label caption>
              State
            </q-item-label>
            <DigitalStateField
              :value="block.data.desiredState"
              :pending="block.data.state !== block.data.desiredState"
              :pending-reason="constrainers"
              :disable="isDriven"
              @input="v => { block.data.desiredState = v; saveBlock(); }"
            />
          </q-item-section>
          <q-item-section style="justify-content: flex-start">
            <q-item-label caption>
              Invert
            </q-item-label>
            <q-toggle
              :value="block.data.invert"
              @input="v => { block.data.invert = v; saveBlock(); }"
            />
          </q-item-section>
        </q-item>

        <q-item dark>
          <q-item-section>
            <DrivenIndicator :block-id="block.id" :service-id="serviceId" />
            <ConstraintsField
              :value="block.data.constrainedBy"
              :service-id="serviceId"
              type="digital"
              @input="v => { block.data.constrainedBy = v; saveBlock(); }"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </graphcardwrapper>
</template>
