<script lang="ts">
import isString from 'lodash/isString';
import mapValues from 'lodash/mapValues';
import UrlSafeString from 'url-safe-string';
import { Component } from 'vue-property-decorator';

import WizardTaskBase from '@/components/Wizard/WizardTaskBase';
import { spaceCased, suggestId, valOrDefault } from '@/helpers/functional';
import { FermentConfig, FermentConfigNames } from '@/plugins/spark/arrangements/Ferment/types';
import { typeName } from '@/plugins/spark/getters';
import { blockIdRules } from '@/plugins/spark/helpers';
import { GroupsBlock } from '@/plugins/spark/provider/types';
import { sparkStore } from '@/plugins/spark/store';
import { serviceStore } from '@/store/services';


@Component
export default class FermentNamingTask extends WizardTaskBase {
  spaceCased = spaceCased;
  readonly config!: FermentConfig;

  chosenNames: Partial<FermentConfigNames> = {};

  get serviceOpts(): SelectOption[] {
    return serviceStore.serviceValues
      .filter(svc => svc.type === typeName)
      .map(svc => ({ label: svc.title, value: svc.id }));
  }

  get serviceId(): string {
    let id = this.config.serviceId;
    if (!id && this.serviceOpts.length > 0) {
      id = this.serviceOpts[0].value;
    }
    return id;
  }

  set serviceId(serviceId: string) {
    this.updateConfig<FermentConfig>({ ...this.config, serviceId });
  }

  get groupError(): string | null {
    const block: GroupsBlock | undefined =
      sparkStore.blockValues(this.serviceId)
        .find(block => block.type === 'Groups');
    const names = sparkStore.groupNames(this.serviceId);
    return block && block.data.active.includes(0)
      ? null
      : `Group '${names[0]}' is disabled. Created blocks will be inactive.`;
  }

  get arrangementId(): string {
    return valOrDefault(this.config.arrangementId, 'Fermentation');
  }

  set arrangementId(id: string) {
    this.updateConfig<FermentConfig>({ ...this.config, arrangementId: id });
  }

  get prefix(): string {
    return valOrDefault(this.config.prefix, this.arrangementId.slice(0, 7));
  }

  set prefix(prefix: string) {
    this.updateConfig<FermentConfig>({ ...this.config, prefix });
  }

  get dashboardTitle(): string {
    return valOrDefault(this.config.dashboardTitle, `${this.arrangementId} Dashboard`);
  }

  set dashboardTitle(id: string) {
    this.updateConfig<FermentConfig>({ ...this.config, dashboardTitle: id });
  }

  get defaultNames(): FermentConfigNames {
    return {
      fridgeSensor: 'Fridge Sensor',
      beerSensor: 'Beer Sensor',
      fridgeSSPair: 'Fridge Setting',
      beerSSPair: 'Beer Setting',
      tempProfile: 'Temperature Profile',
      coolAct: 'Cool Actuator',
      heatAct: 'Heat Actuator',
      coolPwm: 'Cool PWM',
      heatPwm: 'Heat PWM',
      mutex: 'Mutex',
      coolPid: 'Cool PID',
      heatPid: 'Heat PID',
    };
  }

  get names(): FermentConfigNames {
    const validate = (val): boolean => !blockIdRules(this.serviceId)
      .map(rule => rule(val))
      .some(isString);
    return {
      ...mapValues(this.defaultNames, v => suggestId(`${this.prefix} ${v}`, validate)),
      ...this.chosenNames,
    };
  }

  get nameRules(): InputRule[] {
    return [
      ...blockIdRules(this.serviceId),
      v => Object.values(this.names)
        .filter(n => n === v).length < 2 || "Name can't be a duplicate",
    ];
  }

  get valuesOk(): boolean {
    return [
      this.serviceId,
      this.dashboardTitle,
      ...Object.values(this.names),
      ...Object.values(this.names).map(v => !this.nameError(v)),
    ]
      .every(Boolean);
  }

  nameError(val: string): string {
    const result = this.nameRules
      .map(rule => rule(val))
      .find(result => isString(result)) as string;
    return result ? result : '';
  }

  updateName(key: string, val: string): void {
    this.$set(this.chosenNames, key, val.trim());
  }

  clearKey(key: string): void {
    delete this.config[key];
    this.updateConfig<FermentConfig>(this.config);
  }

  clearName(key: string): void {
    this.$delete(this.chosenNames, key);
  }

  taskDone(): void {
    this.updateConfig<FermentConfig>({
      ...this.config,
      serviceId: this.serviceId,
      arrangementId: this.arrangementId,
      prefix: this.prefix,
      dashboardId: new UrlSafeString().generate(this.dashboardTitle),
      dashboardTitle: this.dashboardTitle,
      groups: [0],
      names: this.names,
      widgets: [],
      createdBlocks: [],
      changedBlocks: [],
      renamedBlocks: {},
    });
    this.next();
  }
}
</script>

<template>
  <div>
    <q-card-section style="height: 60vh">
      <q-scroll-area>
        <q-item dark class="text-weight-light">
          <q-item-section>
            <q-item-label class="text-subtitle1">
              Name your blocks and dashboards
            </q-item-label>
            <p>
              Enter a name for your new process below. The prefix will be used to suggest names for your new blocks.
            </p>
          </q-item-section>
        </q-item>


        <CardWarning v-if="groupError">
          <template #message>
            {{ groupError }}
          </template>
        </CardWarning>
        <!-- Generic settings -->

        <q-expansion-item default-opened label="Setup name" icon="settings" dense>
          <q-item dark>
            <q-select
              v-model="serviceId"
              :options="serviceOpts"
              options-dark
              map-options
              emit-value
              label="Service"
              dark
            />
          </q-item>
          <q-item dark>
            <q-input v-model="arrangementId" label="Process name" dark>
              <template v-slot:append>
                <q-btn
                  icon="mdi-backup-restore"
                  flat
                  round
                  size="sm"
                  color="white"
                  @click="clearKey('arrangementId')"
                >
                  <q-tooltip>Reset to default</q-tooltip>
                </q-btn>
                <q-icon name="mdi-information">
                  <q-tooltip>
                    The full name of your arrangement.
                    It will be used as the default dashboard title.
                    <br />The default prefix is the short version of this.
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item dark>
            <q-input v-model="prefix" label="Prefix" dark>
              <template v-slot:append>
                <q-btn
                  icon="mdi-backup-restore"
                  flat
                  round
                  size="sm"
                  color="white"
                  @click="clearKey('prefix')"
                >
                  <q-tooltip>Reset to default</q-tooltip>
                </q-btn>
                <q-icon name="mdi-information">
                  <q-tooltip>
                    By default all block names are prefixed.
                    You can override this for individual blocks.
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item dark>
            <q-input v-model="dashboardTitle" :error="!dashboardTitle" label="Dashboard" dark>
              <template v-slot:append>
                <q-btn
                  icon="mdi-backup-restore"
                  flat
                  round
                  size="sm"
                  color="white"
                  @click="clearKey('dashboardTitle')"
                >
                  <q-tooltip>Restore to default</q-tooltip>
                </q-btn>
                <q-icon name="mdi-information">
                  <q-tooltip>The name for the new dashboard</q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-item>
        </q-expansion-item>

        <!-- Block names -->
        <q-expansion-item label="Block names" icon="mdi-tag-multiple" dense>
          <q-item v-for="(nVal, nKey) in names" :key="nKey">
            <q-input
              :value="nVal"
              :error="!!nameError(nVal)"
              :label="defaultNames[nKey]"
              dark
              bottom-slots
              @input="v => updateName(nKey, v)"
            >
              <template v-slot:append>
                <q-btn
                  icon="mdi-backup-restore"
                  flat
                  round
                  size="sm"
                  color="white"
                  @click="clearName(nKey)"
                />
              </template>
              <template v-slot:error>
                {{ nameError(nVal) }}
              </template>
            </q-input>
          </q-item>
        </q-expansion-item>
      </q-scroll-area>
    </q-card-section>

    <q-separator dark />

    <q-card-actions>
      <q-btn unelevated label="Back" @click="back" />
      <q-space />
      <q-btn :disable="!valuesOk" unelevated label="Next" color="primary" @click="taskDone" />
    </q-card-actions>
  </div>
</template>
