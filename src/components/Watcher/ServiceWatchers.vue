<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { providerStore } from '@/store/providers';
import { serviceStore } from '@/store/services';

@Component
export default class ServiceWatchers extends Vue {
  get watchers(): { serviceId: string; component: string }[] {
    return serviceStore.serviceValues
      .map(service => ({
        serviceId: service.id,
        component: providerStore.watcherById(service.type) || '',
      }))
      .filter(w => !!w.component);
  }
}
</script>

<template>
  <div style="height: 0px; width: 0px;">
    <component
      :is="watcher.component"
      v-for="watcher in watchers"
      :key="watcher.serviceId"
      :service-id="watcher.serviceId"
    />
  </div>
</template>
