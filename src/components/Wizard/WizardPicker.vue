<script lang="ts">
import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';

@Component
export default class WizardPicker extends Vue {
  title: string | null = null;
  wizardComponent: string | null = null;

  @Prop({ type: String, required: false })
  readonly dashboardId!: string;

  @Prop({ type: String, required: false })
  readonly initialComponent!: string;

  @Emit()
  close(): void { }

  reset(): void {
    this.wizardComponent = null;
    this.title = 'Wizardry';
  }

  mounted(): void {
    this.reset();
    this.wizardComponent = this.initialComponent;
  }
}
</script>

<template>
  <q-card dark class="widget-modal">
    <DialogToolbar><q-icon name="mdi-creation" class="q-mx-sm" />{{ title }}</DialogToolbar>
    <component
      :is="wizardComponent"
      v-if="wizardComponent"
      @title="v => title = v"
      @back="reset"
      @close="close"
    />

    <q-scroll-area v-else style="height: 80vh;">
      <q-card-section>
        <q-item link clickable dark @click="wizardComponent = 'ArrangementWizardPicker'">
          <q-item-section side class="col-4">
            <q-item-label class="text-h6">
              Quick Start
            </q-item-label>
            <q-item-label caption>
              Add a brewing process
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <p>This wizard helps to set up common brewing setups, like a fermentation fridge or a HERMS.</p>
            <p>
              It will create all required blocks on the controller
              and a new dashboard for quick access to settings and graphs.
            </p>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-item link clickable dark @click="wizardComponent = 'DashboardWizard'">
          <q-item-section side class="col-4">
            <q-item-label class="text-h6">
              New Dashboard
            </q-item-label>
            <q-item-label caption>
              Add an empty dashboard
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <p>You can then add widgets to a dashboard to create a custom UI for your brewery.</p>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-item link clickable dark @click="wizardComponent = 'WidgetWizardPicker'">
          <q-item-section side class="col-4">
            <q-item-label class="text-h6">
              New Widget
            </q-item-label>
            <q-item-label caption>
              Add a widget to a dashboard
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <p>A widget is a card on dashboard with a specific function. Many different widget types are available.</p>
            <p>
              There are widgets for each block type on the controller, graph widgets, brewery overview widgets and more.
            </p>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-item link clickable dark @click="wizardComponent = 'ImportWizard'">
          <q-item-section side class="col-4">
            <q-item-label class="text-h6">
              Import Widget
            </q-item-label>
            <q-item-label caption>
              Add a widget from a file
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <p>
              Import a previously exported widget from a file.
            </p>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <q-item link clickable dark @click="wizardComponent = 'ServiceWizardPicker'">
          <q-item-section side class="col-4">
            <q-item-label class="text-h6">
              New service
            </q-item-label>
            <q-item-label caption>
              Add a service to the UI
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <p>
              If you have multiple BrewBlox Sparks, you will have a separate service to connect each one.
            </p>
            <p>
              You should add them to the UI here, after you have added them in your docker-compose file.
            </p>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-scroll-area>
  </q-card>
</template>
