<script lang="ts">
import { debounce, uid } from 'quasar';
import { Component, Watch } from 'vue-property-decorator';

import WidgetBase from '@/components/Widget/WidgetBase';
import { createDialog } from '@/helpers/dialog';

import { calculateNormalizedFlows } from './calculateFlows';
import { defaultLayoutHeight, defaultLayoutWidth, deprecatedTypes, SQUARE_SIZE } from './getters';
import { asPersistentPart, asStatePart } from './helpers';
import { builderStore } from './store';
import { BuilderConfig, BuilderLayout, FlowPart, PartUpdater, PersistentPart } from './types';


@Component
export default class BuilderWidget extends WidgetBase {
  specs = builderStore.specs;
  flowParts: FlowPart[] = [];
  debouncedCalculate: Function = () => { };

  get widgetConfig(): BuilderConfig {
    return {
      currentLayoutId: null,
      layoutIds: [],
      ...this.widget.config as Partial<BuilderConfig>,
    };
  }

  get layout(): BuilderLayout | null {
    return builderStore.layoutById(this.widgetConfig.currentLayoutId || '');
  }

  set layout(layout: BuilderLayout | null) {
    this.saveConfig({
      ...this.widgetConfig,
      currentLayoutId: layout ? layout.id : null,
    });
  }

  get allLayouts(): BuilderLayout[] {
    return builderStore.layoutValues;
  }

  get activeLayouts(): BuilderLayout[] {
    return this.widgetConfig
      .layoutIds
      .map(builderStore.layoutById)
      .filter(v => !!v);
  }

  get wrongBrowser(): boolean {
    return /(Edge|MSIE)/.test(window.navigator.userAgent);
  }

  get editorActive(): boolean {
    return builderStore.editorActive;
  }

  get currentIdx(): number {
    return this.widgetConfig.layoutIds.findIndex(id => !!this.layout && id === this.layout.id);
  }

  set currentIdx(idx: number) {
    this.saveConfig({
      ...this.widgetConfig,
      currentLayoutId: idx >= 0 ? this.activeLayouts[idx].id : null,
    });
  }

  async saveParts(parts: PersistentPart[]): Promise<void> {
    if (!this.layout) {
      return;
    }

    // first set local value, to avoid jitters caused by the period between action and vueX refresh
    this.layout.parts = parts.map(asPersistentPart);
    await builderStore.saveLayout(this.layout);
    this.debouncedCalculate();
  }

  async savePart(part: PersistentPart): Promise<void> {
    await this.saveParts(this.parts.map(p => (p.id === part.id ? part : p)));
  }

  get parts(): PersistentPart[] {
    if (!this.layout) {
      return [];
    }
    const sizes: Record<string, number> = {};
    return this.layout.parts
      .map(part => {
        const actual: PersistentPart = {
          id: uid(),
          rotate: 0,
          settings: {},
          flipped: false,
          ...part,
          type: deprecatedTypes[part.type] || part.type,
        };
        const [sizeX, sizeY] = this.specs[actual.type].size(actual);
        sizes[part.id] = sizeX * sizeY;
        return actual;
      })
      // sort parts to render largest first
      .sort((a, b) => sizes[b.id] - sizes[a.id]);
  }

  get updater(): PartUpdater {
    return {
      updatePart: this.savePart,
    };
  }

  isClickable(part): boolean {
    return !!this.specs[part.type].interactHandler;
  }

  interact(part: FlowPart): void {
    const handler = this.specs[part.type].interactHandler;
    handler && handler(part, this.updater);
  }

  squares(val: number): number {
    return SQUARE_SIZE * val;
  }

  startEditor(): void {
    createDialog({
      component: 'BuilderEditor',
      initialLayout: this.widgetConfig.currentLayoutId,
      root: this.$root,
    });
  }

  async calculate(): Promise<void> {
    await this.$nextTick();
    if (!this.editorActive) {
      this.flowParts = calculateNormalizedFlows(this.parts.map(asStatePart));
    }
  }

  async migrate(): Promise<void> {
    const oldParts: PersistentPart[] = (this.widgetConfig as any).parts;
    if (oldParts) {
      const id = uid();
      await builderStore.createLayout({
        id,
        title: `${this.widget.title} layout`,
        width: defaultLayoutWidth,
        height: defaultLayoutHeight,
        parts: oldParts,
      });
      this.widgetConfig.layoutIds.push(id);
      this.widgetConfig.currentLayoutId = id;
      this.$delete(this.widgetConfig, 'parts');
      this.saveConfig(this.widgetConfig);
    }
  }

  created(): void {
    this.migrate();
    this.debouncedCalculate = debounce(this.calculate, 200, false);
    this.debouncedCalculate();
  }

  @Watch('layout')
  watchLayout(): void {
    this.debouncedCalculate();
  }

  @Watch('editorActive')
  watchActive(): void {
    this.debouncedCalculate();
  }
}
</script>

<template>
  <q-card dark class="text-white column">
    <WidgetToolbar :title="widget.title" :subtitle="displayName">
      <q-item-section side>
        <q-btn
          :disable="wrongBrowser"
          unelevated
          color="primary"
          label="Editor"
          @click="startEditor"
        >
          <q-tooltip v-if="wrongBrowser">
            The Builder Editor is not supported by IE/Edge browsers.
          </q-tooltip>
        </q-btn>
      </q-item-section>
      <q-item-section side>
        <q-btn-dropdown flat split icon="settings" @click="showForm">
          <q-list dark bordered>
            <ExportAction :crud="crud" />
            <WidgetActions :crud="crud" />
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
    </WidgetToolbar>
    <q-item v-if="activeLayouts.length > 1" dark>
      <q-item-section class="col-auto">
        <q-btn :disable="currentIdx <= 0" icon="mdi-chevron-left" flat @click="currentIdx--" />
      </q-item-section>
      <q-item-section>
        <q-btn-dropdown :label="layout ? layout.title : 'None'" flat no-caps icon="widgets">
          <q-list dark bordered>
            <ActionItem
              v-for="lay in activeLayouts"
              :key="lay.id"
              :label="lay.title"
              :active="layout && lay.id === layout.id"
              icon="mdi-view-dashboard-outline"
              @click="layout = lay"
            />
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
      <q-item-section class="col-shrink ellipsis">
        <q-btn
          :disable="currentIdx === activeLayouts.length-1"
          icon-right="mdi-chevron-right"
          flat
          @click="currentIdx++"
        />
      </q-item-section>
    </q-item>

    <div class="col">
      <span v-if="parts.length === 0" class="absolute-center column">
        <q-btn
          v-if="activeLayouts.length === 0"
          outline
          label="Choose layouts"
          class="q-mb-md"
          @click="showForm"
        />
        <q-btn v-if="!wrongBrowser" outline label="Edit Layout" @click="startEditor" />
      </span>
      <svg ref="grid" class="grid-base">
        <g
          v-for="part in flowParts"
          :key="part.id"
          :transform="`translate(${squares(part.x)}, ${squares(part.y)})`"
          :class="{ clickable: isClickable(part), [part.type]: true }"
          @click="interact(part)"
        >
          <PartWrapper :part="part" @update:part="savePart" @dirty="debouncedCalculate" />
        </g>
      </svg>
    </div>
  </q-card>
</template>

<style lang="stylus" scoped>
@import './grid.styl';
</style>
