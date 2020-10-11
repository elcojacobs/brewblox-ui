import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { SparkServiceModule, sparkStore } from '@/plugins/spark/store';

@Component
export default class ValEditBase extends Vue {
  @Prop({ type: String, required: true })
  public readonly serviceId!: string;

  @Prop({ type: String, required: true })
  public readonly blockId!: string;

  @Prop({ type: Boolean, default: false })
  public readonly editable!: boolean;

  @Prop({ type: Boolean, default: false })
  public readonly lazy!: boolean;

  @Prop({ type: Boolean, default: true })
  public readonly dense!: boolean;

  @Prop({ required: true })
  public readonly value!: any;

  public saveField(val: any): void {
    this.$emit('input', val);
  }

  public startEdit(): void {
    this.$emit('edit');
  }

  public get sparkModule(): SparkServiceModule {
    return sparkStore.moduleById(this.serviceId)!;
  }

  public get field(): any {
    return this.value;
  }

  public set field(val: any) {
    this.saveField(val);
  }
}
