<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';

import { createDialog } from '@/helpers/dialog';
import { prettify, Unit } from '@/helpers/units';

import FieldBase from './FieldBase';

@Component
export default class UnitField extends FieldBase {
  prettify = prettify;

  @Prop({ type: Object, required: true, validator: v => v instanceof Unit })
  public readonly value!: Unit;

  @Prop({ type: String, default: 'value' })
  public readonly label!: string;

  @Prop({ type: Number, default: 2 })
  readonly decimals!: number;

  @Prop({ type: String, default: 'small' })
  public readonly unitTag!: string;

  @Emit('input')
  public change(v: Unit): Unit {
    return v;
  }

  openDialog(): void {
    if (this.readonly) {
      return;
    }
    createDialog({
      component: 'UnitDialog',
      title: this.title,
      message: this.message,
      messageHtml: this.messageHtml,
      root: this.$root,
      value: this.value,
      label: this.label,
    })
      .onOk(this.change);
  }
}
</script>

<template>
  <component :is="tag" v-bind="tagProps" :class="tagClass" @click="openDialog">
    <slot name="pre" />
    <slot name="value">
      <span :class="{editable: !readonly}">{{ value.value | round }}</span>
    </slot>
    <component :is="unitTag" v-if="value.value !== null" class="q-ml-xs">
      {{ value.notation }}
    </component>
    <slot />
    <q-tooltip v-if="!readonly">
      Set {{ label }}
    </q-tooltip>
  </component>
</template>
