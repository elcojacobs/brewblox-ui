<script lang="ts">
import get from 'lodash/get';
import { Component } from 'vue-property-decorator';

import BlockCrudComponent from '@/plugins/spark/components/BlockCrudComponent';
import { sparkStore } from '@/plugins/spark/store';

import { Block } from '../../types';
import { FilterChoice, SetpointSensorPairBlock } from './types';

@Component
export default class SetpointSensorPairForm extends BlockCrudComponent {
  readonly block!: SetpointSensorPairBlock;

  get filterOpts(): SelectOption[] {
    return Object.keys(FilterChoice)
      .filter(val => !Number.isNaN(Number(val)))
      .map(value => ({
        value: Number(value),
        label: FilterChoice[value].replace('Filter', '').replace('NoFiltering', 'No Filtering'),
      }));
  }

  get usedBy(): Block[] {
    if (!this.isStoreBlock) {
      return [];
    }
    return sparkStore.blockValues(this.serviceId)
      .filter(block => get(block, 'data.inputId.id') === this.blockId);
  }

  get disabledString(): string {
    if (this.usedBy.length === 0) {
      return 'This setpoint is disabled and is not used.';
    } else if (this.usedBy.length == 1) {
      return `This setpoint is disabled and therefore '${this.usedBy[0].id}' is inactive.`;
    } else {
      return `This setpoint is disabled and therefore ${this.usedBy.map(v => `'${v.id}'`).join(' and ')} are inactive.`;
    }
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

      <BlockEnableToggle
        :crud="crud"
        :text-disabled="disabledString"
        text-enabled="Setpoint is enabled."
        data-key="settingEnabled"
        class="full-width bordered"
      />
      <q-card-section>
        <q-separator dark inset />

        <q-item dark class="align-children">
          <q-item-section class="col-4">
            <q-item-label caption>
              Setting
            </q-item-label>
            <UnitField
              :value="block.data.storedSetting"
              :readonly="isDriven"
              :class="{darkened: !block.data.settingEnabled}"
              title="Setting"
              tag="big"
              @input="v => { block.data.storedSetting = v; saveBlock(); }"
            />
          </q-item-section>
          <q-item-section v-if="usedBy.length">
            <q-item-label caption>
              Input for:
            </q-item-label>
            <div class="row">
              <q-btn
                v-for="block in usedBy"
                :key="block.id"
                :label="block.id"
                dense
                no-caps
                flat
                class="q-py-xs"
                @click="showOtherBlock(block)"
              />
            </div>
          </q-item-section>
          <template v-else>
            <q-item-section>This setpoint is not used as PID input</q-item-section>
          </template>
        </q-item>

        <q-item dark class="align-children">
          <q-item-section class="col-4">
            <q-item-label caption>
              Sensor value
            </q-item-label>
            <UnitField :value="block.data.value" tag="big" readonly />
          </q-item-section>
          <q-item-section class="col-3">
            <q-item-label caption>
              Filter period
            </q-item-label>
            <SelectField
              :value="block.data.filter"
              :options="filterOpts"
              title="Filter"
              label="Filter period"
              message-html="
              <p>
                A filter averages multiple sensor values to remove noise, spikes and sudden jumps.
                Changes faster than the filter period will be filted out.
              </p>
              <p>
                A longer period will give a smoother output at the cost of a delay in response.
                This delay is equal to the chosen period.
              </p>
              "
              @input="v => { block.data.filter = v; saveBlock(); }"
            />
          </q-item-section>
          <q-item-section class="col-3">
            <q-item-label caption>
              Bypass threshold
            </q-item-label>
            <UnitField
              :value="block.data.filterThreshold"
              title="Filter bypass threshold"
              label="Filter threshold to bypass filtering"
              message-html="
              <p>
                The filter can detect when a large step occurs at the input and temporary bypass slow filtering.
                The threshold for an input change that should trigger this can be set here.
              </p>
              "
              @input="v => { block.data.filterThreshold = v; saveBlock(); }"
            />
          </q-item-section>
          <q-item-section>
            <q-btn
              flat
              round
              icon="mdi-skip-forward"
              @click="block.data.resetFilter = true; saveBlock()"
            >
              <q-tooltip>Bypass filter now</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item dark class="align-children">
          <q-item-section class="col-4">
            <q-item-label caption>
              Unfiltered sensor value
            </q-item-label>
            <UnitField :value="block.data.valueUnfiltered" tag="big" readonly />
          </q-item-section>
          <q-item-section class="col-4">
            <q-item-label caption>
              Sensor block
            </q-item-label>
            <LinkField
              :value="block.data.sensorId"
              :service-id="serviceId"
              title="Sensor Block"
              tag="span"
              @input="v => { block.data.sensorId = v; saveBlock(); }"
            />
          </q-item-section>
        </q-item>

        <q-item dark>
          <q-item-section>
            <DrivenIndicator :block-id="block.id" :service-id="serviceId" />
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </graphcardwrapper>
</template>
