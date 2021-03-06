<script lang="ts">
import { Component, Ref } from 'vue-property-decorator';
import { Watch } from 'vue-property-decorator';

import { defaultPresets } from '@/components/Graph/getters';
import HistoryGraph from '@/components/Graph/HistoryGraph.vue';
import { GraphConfig } from '@/components/Graph/types';
import WidgetBase from '@/components/Widget/WidgetBase';
import { QueryParams } from '@/store/history';

@Component
export default class GraphWidget extends WidgetBase {
  settingsModalOpen = false;
  graphModalOpen = false;
  downsampling: any = {};

  @Ref()
  readonly widgetGraph!: HistoryGraph;

  get graphCfg(): GraphConfig {
    return {
      layout: {},
      params: {},
      targets: [],
      renames: {},
      axes: {},
      colors: {},
      ...this.widget.config,
    };
  }

  get presets(): QueryParams[] {
    return defaultPresets();
  }

  isActivePreset(preset: QueryParams): boolean {
    return JSON.stringify(preset) === JSON.stringify(this.graphCfg.params);
  }

  applyPreset(preset: QueryParams): void {
    this.saveConfig({
      ...this.graphCfg,
      params: { ...preset },
    });
  }

  @Watch('graphCfg', { deep: true })
  regraph(): void {
    this.$nextTick(() => this.widgetGraph.resetListeners());
  }

  mounted(): void {
    this.$watch('widget.cols', () => this.widgetGraph.refresh());
    this.$watch('widget.rows', () => this.widgetGraph.refresh());
  }
}
</script>

<template>
  <q-card dark class="text-white column">
    <q-dialog v-model="settingsModalOpen" no-backdrop-dismiss class="row">
      <GraphCardWrapper show-initial>
        <template #graph>
          <HistoryGraph :id="widget.id" :config="graphCfg" shared-listeners />
        </template>
        <GraphForm v-if="settingsModalOpen" :crud="crud" :downsampling="downsampling" />
      </GraphCardWrapper>
    </q-dialog>

    <q-dialog v-model="graphModalOpen" maximized>
      <q-card v-if="graphModalOpen" dark>
        <HistoryGraph :id="widget.id" :config="graphCfg" shared-listeners>
          <template v-slot:controls>
            <q-btn-dropdown flat auto-close label="presets" icon="mdi-timelapse">
              <q-list dark link>
                <q-item
                  v-for="(preset, idx) in presets"
                  :key="idx"
                  :active="isActivePreset(preset)"
                  dark
                  clickable
                  @click="applyPreset(preset)"
                >
                  <q-item-section>{{ preset.duration }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn v-close-popup flat label="close" />
          </template>
        </HistoryGraph>
      </q-card>
    </q-dialog>

    <WidgetToolbar :title="widget.title" :subtitle="displayName">
      <q-item-section side>
        <q-btn-dropdown flat split icon="settings" @click="settingsModalOpen = true">
          <q-list dark bordered>
            <ActionItem
              icon="mdi-chart-line"
              label="Show maximized"
              @click="graphModalOpen = true"
            />
            <ActionItem icon="refresh" label="Refresh" @click="regraph" />
            <q-expansion-item label="Timespan">
              <q-list dark>
                <q-item
                  v-for="(preset, idx) in presets"
                  :key="idx"
                  v-close-popup
                  :inset-level="1"
                  dark
                  clickable
                  @click="applyPreset(preset)"
                >
                  <q-item-section>{{ preset.duration }}</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <WidgetActions :crud="crud" />
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
    </WidgetToolbar>

    <div class="col">
      <HistoryGraph
        :id="widget.id"
        ref="widgetGraph"
        :config="graphCfg"
        @downsample="v => downsampling = v"
      />
    </div>
  </q-card>
</template>
