<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import Component from 'vue-class-component';
import { Notify } from 'quasar';
import { serviceAvailable } from '@/helpers/dynamic-store';
import { DashboardItem } from '@/store/dashboards/state';
import { Block } from '@/plugins/spark/state';
import { allBlocks } from '@/plugins/spark/store/getters';
import {
  featureIds,
  widgetById,
  widgetSizeById,
  deletersById,
} from '@/store/features/getters';
import { dashboardItemIds, allDashboards, itemCopyName } from '@/store/dashboards/getters';
import { createDashboardItem } from '@/store/dashboards/actions';
import { widgetSize, isSystemBlock } from './getters';

@Component({
  props: {
    serviceId: {
      type: String,
      required: true,
    },
  },
})
export default class SparkPage extends Vue {
  $q: any;
  editable: boolean = false;

  get dashboards() {
    return allDashboards(this.$store);
  }

  defaultItem(block: Block): DashboardItem {
    return {
      id: block.id,
      widget: block.type,
      order: 0,
      dashboard: '',
      config: {
        serviceId: block.serviceId,
        blockId: block.id,
      },
      ...widgetSizeById(this.$store, block.type),
    };
  }

  get isAvailable() {
    return serviceAvailable(this.$store, this.$props.serviceId);
  }

  get items() {
    if (!this.isAvailable) {
      return [];
    }
    return [
      ...allBlocks(this.$store, this.$props.serviceId)
        .filter(block => !isSystemBlock(block))
        .map(this.defaultItem),
    ];
  }

  get widgetSize() {
    return widgetSize;
  }

  widgetComponent(id: string): string {
    return this.editable
      ? 'EditWidget'
      : (widgetById(this.$store, id) || 'InvalidWidget');
  }

  onDeleteItem(item: DashboardItem) {
    // Quasar dialog can't handle objects as value - they will be returned as null
    // As workaround, we use array index as value, and add the "action" key to each option
    const opts = deletersById(this.$store, item.widget)
      .map((del, idx) => ({ label: del.description, value: idx, action: del.action }));

    if (opts.length === 0) {
      Notify.create('This block can\'t be deleted');
      return;
    }

    this.$q.dialog({
      title: 'Delete block',
      message: `How do you want to delete ${item.id}?`,
      options: {
        type: 'checkbox',
        model: opts.map(opt => opt.value),
        items: opts,
      },
      cancel: true,
    })
      .then((selected: number[]) =>
        selected.forEach(idx => opts[idx].action(this.$store, item.config)))
      .catch(() => { });
  }

  onCopyItem(item: DashboardItem) {
    const id = itemCopyName(this.$store, item.id);
    this.$q.dialog({
      title: 'Create widget',
      message: `On which dashboard do you want to create a widget for ${item.id}?`,
      options: {
        type: 'radio',
        model: null,
        items: this.dashboards
          .map(dashboard => ({ label: dashboard.title, value: dashboard.id })),
      },
      cancel: true,
    })
      .then((dashboard: string) =>
        dashboard && createDashboardItem(this.$store, { ...item, id, dashboard }))
      .catch(() => { });
  }

  onWidgetChange() {
    this.$q.notify('Widget settings can\'t be saved in this page');
  }
}
</script>

<template>
  <div>
    <q-inner-loading :visible="items.length === 0">
      <q-spinner
        size="50px"
        color="primary"
      />
    </q-inner-loading>

    <template>
      <portal to="toolbar-title">
        <div>
          Blocks
        </div>
      </portal>

      <portal to="toolbar-buttons">

        <q-btn
          :icon="editable ? 'check' : 'mode edit'"
          :color="editable ? 'positive' : 'primary'"
          @click="() => editable = !editable"
          :label="editable ? 'Stop editing' : 'Edit blocks'"
        />

      </portal>

      <grid-container>
        <SparkWidget
          class="dashboard-item"
          :id="$props.serviceId"
          :serviceId="$props.serviceId"
          :cols="widgetSize.cols"
          :rows="widgetSize.rows"
        />
        <component
          class="dashboard-item"
          v-for="item in items"
          :is="widgetComponent(item.widget)"
          :key="item.id"
          :id="item.id"
          :type="item.widget"
          :cols="item.cols"
          :rows="item.rows"
          :config="item.config"
          :onConfigChange="onWidgetChange"
          :onIdChange="onWidgetChange"
          :onDeleteItem="() => onDeleteItem(item)"
          :onCopyItem="() => onCopyItem(item)"
        />
      </grid-container>
    </template>
  </div>
</template>

<style lang="stylus" scoped>
@import '../../../css/app.styl';

.dashboard-item {
  background: $block-background;
  height: 100%;
  width: 100%;
}
</style>