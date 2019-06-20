<script lang="ts">
import get from 'lodash/get';
import { Dialog } from 'quasar';
import { Component, Prop } from 'vue-property-decorator';

import DialogBase from '@/components/Dialog/DialogBase';
import { objectStringSorter } from '@/helpers/functional';
import { Link } from '@/helpers/units';
import sparkStore from '@/plugins/spark/store';

@Component
export default class LinkDialog extends DialogBase {
  link: Link | null = null

  @Prop({ type: Object })
  public readonly value!: Link;

  @Prop({ type: String, required: true })
  readonly serviceId!: string;

  @Prop({ type: String, default: 'Link' })
  public readonly label!: string;

  @Prop({ type: Function })
  readonly filter!: (link: Link) => boolean;

  @Prop({ type: Boolean, default: false })
  public readonly clearable!: boolean;

  @Prop({ type: Boolean, default: false })
  public readonly noCreate!: boolean;

  get compatibleTypes() {
    if (this.value.type === null) {
      return null;
    }
    const compatibleTable = sparkStore.compatibleTypes(this.serviceId);
    return [this.value.type, ...get(compatibleTable, this.value.type, [])];
  }

  get actualFilter() {
    if (this.filter) {
      return this.filter;
    }
    return block => !this.compatibleTypes || this.compatibleTypes.includes(block.type);
  }

  get linkOpts(): Link[] {
    return sparkStore.blockValues(this.serviceId)
      .map(block => new Link(block.id, block.type))
      .filter(this.actualFilter)
      .sort(objectStringSorter('id'));
  }

  updateLink(link: Link | null) {
    this.link = link || new Link(null, this.value.type);
  }

  create() {
    Dialog.create({
      component: 'BlockWizardDialog',
      root: this.$root,
      serviceId: this.serviceId,
      filter: feat => !this.compatibleTypes || this.compatibleTypes.includes(feat),
    })
      .onOk(block => {
        // Retain original type
        this.link = new Link(block.id, this.value.type);
      });
  }

  created() {
    this.link = this.value.copy();
  }
}
</script>

<template>
  <q-dialog
    ref="dialog"
    no-backdrop-dismiss
    @hide="onDialogHide"
    @keyup.enter="(link || clearable) && onDialogOk(link)"
  >
    <q-card class="q-dialog-plugin q-dialog-plugin--dark" dark>
      <q-card-section class="q-dialog__title">{{ title }}</q-card-section>
      <q-card-section v-if="message" class="q-dialog__message scroll">{{ message }}</q-card-section>
      <q-card-section v-if="messageHtml" class="q-dialog__message scroll" v-html="messageHtml"/>
      <q-card-section class="scroll">
        <q-select
          :value="link"
          :options="linkOpts"
          :clearable="clearable"
          :label="label"
          dark
          options-dark
          option-label="id"
          option-value="id"
          autofocus
          @input="updateLink"
        >
          <template v-slot:no-option>
            <q-item dark>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
          <template v-slot:after v-if="!noCreate">
            <q-btn flat round icon="add" @click="create">
              <q-tooltip>Create new Block</q-tooltip>
            </q-btn>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="onDialogCancel"/>
        <q-btn
          :disable="!clearable && !link"
          flat
          label="OK"
          color="primary"
          @click="onDialogOk(link)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>