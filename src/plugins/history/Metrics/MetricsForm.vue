<script lang="ts">
import get from 'lodash/get';
import parseDuration from 'parse-duration';
import { Component } from 'vue-property-decorator';

import { defaultLabel, targetBuilder, targetSplitter } from '@/components/Graph/functional';
import CrudComponent from '@/components/Widget/CrudComponent';
import { durationString } from '@/helpers/functional';
import { DisplayNames, historyStore } from '@/store/history';

import { DEFAULT_DECIMALS, DEFAULT_FRESH_DURATION } from './getters';
import { MetricsConfig } from './types';

@Component
export default class MetricsForm extends CrudComponent {
  DEFAULT_FRESH_DURATION = DEFAULT_FRESH_DURATION;
  parseDuration = parseDuration;
  durationString = durationString;

  get config(): MetricsConfig {
    return {
      targets: [],
      renames: {},
      params: {},
      freshDuration: {},
      decimals: {},
      ...this.widget.config,
    };
  }

  get selected(): string[] {
    return targetSplitter(this.config.targets);
  }

  set selected(vals: string[]) {
    const targets = targetBuilder(vals || []);
    const renames = vals
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: this.config.renames[key] || defaultLabel(key),
        }),
        {});
    this.saveConfig({ ...this.config, targets, renames });
  }

  get renames(): DisplayNames {
    return this.config.renames;
  }

  set renames(renames: DisplayNames) {
    this.saveConfig({ ...this.config, renames });
  }

  get freshDuration(): Record<string, number> {
    return this.config.freshDuration;
  }

  get decimals(): Record<string, number> {
    return this.config.decimals;
  }

  fieldDecimals(field: string): number {
    return get(this.config.decimals, field, DEFAULT_DECIMALS);
  }

  created(): void {
    historyStore.fetchKnownKeys();
  }

  resetFreshDuration(field: string): void {
    this.$delete(this.config.freshDuration, field);
    this.saveConfig(this.config);
  }

  resetDecimals(field: string): void {
    this.$delete(this.config.decimals, field);
    this.saveConfig(this.config);
  }
}
</script>

<template>
  <q-card dark class="widget-modal">
    <FormToolbar :crud="crud" />

    <q-card-section>
      <q-expansion-item default-opened group="modal" icon="mdi-file-tree" label="Metrics">
        <div class="scroll-parent">
          <q-scroll-area>
            <MetricSelector :selected.sync="selected" />
          </q-scroll-area>
        </div>
      </q-expansion-item>

      <q-expansion-item group="modal" icon="mdi-tag-multiple" label="Labels">
        <div class="scroll-parent">
          <q-scroll-area>
            <LabelSelector :selected="selected" :renames.sync="renames" />
          </q-scroll-area>
        </div>
      </q-expansion-item>

      <q-expansion-item group="modal" icon="warning" label="Old data warnings">
        <div class="scroll-parent">
          <q-scroll-area>
            <q-item dark>
              <q-item-section>Metric</q-item-section>
              <q-item-section>Warn when older than</q-item-section>
              <q-item-section class="col-1" />
            </q-item>
            <q-separator dark inset />
            <q-item v-for="field in selected" :key="field" dark>
              <q-item-section>{{ field }}</q-item-section>
              <q-item-section>
                <InputField
                  :value="durationString(freshDuration[field] || DEFAULT_FRESH_DURATION)"
                  title="Fresh duration"
                  @input="v => { freshDuration[field] = parseDuration(v); saveConfig(config); }"
                />
              </q-item-section>
              <q-item-section class="col-1">
                <q-btn icon="restore" flat @click="resetFreshDuration(field)" />
              </q-item-section>
            </q-item>
          </q-scroll-area>
        </div>
      </q-expansion-item>

      <q-expansion-item group="modal" icon="mdi-numeric" label="Rounding">
        <div class="scroll-parent">
          <q-scroll-area>
            <q-item dark>
              <q-item-section>Metric</q-item-section>
              <q-item-section>Number of decimals</q-item-section>
              <q-item-section class="col-1" />
            </q-item>
            <q-separator dark inset />
            <q-item v-for="field in selected" :key="field" dark>
              <q-item-section>{{ field }}</q-item-section>
              <q-item-section>
                <InputField
                  :value="fieldDecimals(field)"
                  :decimals="0"
                  :rules="[v => v >= 0 || 'Must be 0 or more']"
                  type="number"
                  title="Number of decimals"
                  @input="v => { decimals[field] = v; saveConfig(config); }"
                />
              </q-item-section>
              <q-item-section class="col-1">
                <q-btn icon="mdi-undo-variant" flat @click="resetDecimals(field)" />
              </q-item-section>
            </q-item>
          </q-scroll-area>
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.scroll-parent {
  height: 300px;
  max-height: 30vh;
}
</style>
