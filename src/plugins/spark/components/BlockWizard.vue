<script lang="ts">
import isString from 'lodash/isString';
import { uid } from 'quasar';
import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';

import { createDialog } from '@/helpers/dialog';
import { objectStringSorter } from '@/helpers/functional';
import { blockIdRules } from '@/plugins/spark/helpers';
import { sparkStore } from '@/plugins/spark/store';
import { Block } from '@/plugins/spark/types';
import { DashboardItem } from '@/store/dashboards';
import { featureStore } from '@/store/features';
import { providerStore } from '@/store/providers';

import { BlockCrud } from './BlockCrudComponent';


@Component
export default class BlockWizard extends Vue {
  filteredOptions: any[] = [];
  feature: any = null;
  blockId = '';
  block: Block | null = null;
  widget: DashboardItem | null = null;
  activeDialog: any = null;

  @Prop({ type: String, required: true })
  readonly serviceId!: string;

  @Prop({ type: String })
  public readonly initialFeature!: string;

  @Prop({ type: Function, default: () => () => true })
  public readonly filter!: (feature: string) => boolean;

  @Emit('created')
  public onCreate(block: Block): Block {
    return block;
  }

  @Emit('close')
  public close(): void { }

  get blockIdRules(): InputRule[] {
    return blockIdRules(this.serviceId);
  }

  get createReady(): boolean {
    return !!this.feature && !this.blockIdRules.some(rule => isString(rule(this.blockId)));
  }

  get wizardOptions(): SelectOption[] {
    return providerStore.featuresById('Spark')
      .filter(feat => featureStore.wizardById(feat) === 'BlockWidgetWizard')
      .filter(this.filter)
      .map(id => ({
        label: featureStore.displayNameById(id),
        value: id,
      }))
      .sort(objectStringSorter('label'));
  }

  filterFn(val, update): void {
    if (val === '') {
      update(() => this.filteredOptions = this.wizardOptions);
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      this.filteredOptions = this.wizardOptions
        .filter(opt => opt.label.toLowerCase().match(needle));
    });
  }

  ensureLocalBlock(): void {
    const typeId = this.feature.value;
    this.widget = this.widget || {
      id: uid(),
      title: this.blockId,
      feature: typeId,
      dashboard: '',
      order: 0,
      config: {
        serviceId: this.serviceId,
        blockId: this.blockId,
      },
      ...featureStore.widgetSizeById(typeId),
    };
    this.block = this.block || {
      id: this.blockId,
      serviceId: this.serviceId,
      type: typeId,
      groups: [0],
      data: sparkStore.specs[typeId].generate(),
    };
  }

  configureBlock(): void {
    this.ensureLocalBlock();
    const crud: BlockCrud = {
      widget: this.widget as DashboardItem,
      isStoreWidget: false,
      saveWidget: v => { this.widget = v; },
      block: this.block as Block,
      isStoreBlock: false,
      saveBlock: v => { this.block = v; },
      closeDialog: this.closeDialog,
    };
    this.activeDialog = createDialog({
      component: 'FormDialog',
      root: this.$root,
      getCrud: () => crud,
    });
  }

  closeDialog(): void {
    if (this.activeDialog) {
      this.activeDialog.hide();
      this.activeDialog = null;
    }
  }

  async createBlock(): Promise<void> {
    if (!this.createReady) {
      return;
    }
    this.ensureLocalBlock();
    try {
      await sparkStore.createBlock([this.serviceId, this.block as Block]);
      this.$q.notify({
        icon: 'mdi-check-all',
        color: 'positive',
        message: `Created ${featureStore.displayNameById((this.block as Block).type)} Block '${this.blockId}'`,
      });
      this.onCreate(sparkStore.blockById(this.serviceId, this.blockId));
    } catch (e) {
      this.$q.notify({
        icon: 'error',
        color: 'negative',
        message: `Failed to create Block: ${e.toString()}`,
      });
    }
    this.close();
  }

  created(): void {
    this.feature =
      this.wizardOptions.find(opt => opt.value === this.initialFeature) || null;
  }
}
</script>

<template>
  <q-card dark class="widget-modal" @keyup.enter="createBlock">
    <DialogToolbar>Block wizard</DialogToolbar>

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <q-select
            v-model="feature"
            :options="filteredOptions"
            :rules="[v => !!v || 'You must select a block type']"
            :disable="!!initialFeature"
            dark
            use-input
            options-dark
            label="Block Type"
            @filter="filterFn"
            @change="block = null; widget = null;"
          >
            <template v-slot:no-option>
              <q-item dark>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <q-item dark>
        <q-item-section>
          <q-input v-model="blockId" :rules="blockIdRules" dark label="Block name">
            <template v-slot:append>
              <q-icon name="mdi-information">
                <q-tooltip>
                  The name of the Spark Controller Block.
                  <br />Multiple widgets can display the same Block.
                  <br />Rules:
                  <ul>
                    <li>The name must not be empty.</li>
                    <li>The name must be unique.</li>
                    <li>The name must begin with a letter.</li>
                    <li>The name may only contain alphanumeric characters, space, and _-()|.</li>
                    <li>The name must be less than 200 characters.</li>
                  </ul>
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-separator dark />

    <q-card-actions align="right">
      <q-btn :disable="!createReady" flat label="Configure" @click="configureBlock" />
      <q-btn
        :disable="!createReady"
        unelevated
        label="Create"
        color="primary"
        @click="createBlock"
      />
    </q-card-actions>
  </q-card>
</template>
