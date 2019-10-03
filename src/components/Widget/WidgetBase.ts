import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { createDialog } from '@/helpers/dialog';
import { PersistentWidget } from '@/store/dashboards';
import { featureStore, WidgetContext, WidgetMode } from '@/store/features';

import { Crud } from './CrudComponent';

@Component
export default class WidgetBase extends Vue {
  public activeDialog: any = null;
  public activeMode: WidgetMode | null = null;

  @Prop({ type: Object, required: true })
  public readonly initialCrud!: Crud;

  @Prop({ type: Object, required: true })
  public readonly context!: WidgetContext;

  public get crud(): Crud {
    // Allows overriding by child classes that use an extended Crud
    return this.initialCrud;
  }

  public get mode(): WidgetMode {
    return this.activeMode || this.context.mode;
  }

  public set mode(val: WidgetMode) {
    this.activeMode = val;
  }

  public get widget(): PersistentWidget {
    return this.crud.widget;
  }

  public get isStoreWidget(): boolean {
    return this.crud.isStoreWidget;
  }

  public get displayName(): string {
    return featureStore.displayName(this.widget.feature);
  }

  public get inDialog(): boolean {
    return this.context.container === 'Dialog';
  }

  public get cardClass(): string[] {
    return this.inDialog
      ? ['widget-modal', 'overflow-auto']
      : ['widget-dashboard', 'overflow-auto', 'scroll'];
  }

  public saveWidget(widget: PersistentWidget = this.crud.widget): void {
    this.crud.saveWidget(widget);
  }

  public saveConfig(config: any): void {
    this.saveWidget({ ...this.widget, config });
  }

  public showDialog(args: Record<string, any> = {}): void {
    this.activeDialog = createDialog({
      component: 'WidgetDialog',
      getCrud: () => ({ ...this.crud, closeDialog: this.closeDialog }),
      ...args,
    });
    return this.activeDialog;
  }

  public closeDialog(): void {
    if (this.activeDialog) {
      this.activeDialog.hide();
      this.activeDialog = null;
    }
  }
}
