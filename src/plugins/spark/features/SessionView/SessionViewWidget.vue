<script lang="ts">
import shortid from 'shortid';
import { Component } from 'vue-property-decorator';

import WidgetBase from '@/components/Widget/WidgetBase';
import { createDialog } from '@/helpers/dialog';
import { shortDateString } from '@/helpers/functional';

import { Session, SessionViewConfig } from './types';


@Component
export default class SessionViewWidget extends WidgetBase {
  graphSessionId: string | null = null;
  sessionFilter = '';

  get widgetConfig(): SessionViewConfig {
    return this.widget.config;
  }

  get sessions(): Session[] {
    return this.widgetConfig.sessions
      .filter(session => !session.hidden)
      .filter(session => session.name.toLowerCase().match(this.sessionFilter.toLowerCase()))
      .sort((left: Session, right: Session) => {
        // Sessions are sorted on their end date
        // In order:
        // - running (start, no end)
        // - undefined (no start, no end)
        // - completed (start, end), most recent first
        if (left.end === null && right.end !== null) {
          return -1;
        }
        if (right.end === null && left.end !== null) {
          return 1;
        }
        return Number(right.end) - Number(left.end);
      });
  }

  get graphSession(): Session | null {
    return this.graphSessionId
      ? this.widgetConfig.sessions.find(session => session.id === this.graphSessionId) || null
      : null;
  }

  periodString(session: Session): string {
    if (!session.start && !session.end) {
      return '<not yet started>';
    }
    if (!session.end) {
      return `${shortDateString(session.start)} to <now>`;
    }
    return `${shortDateString(session.start)} to ${shortDateString(session.end)}`;
  }

  openModal(activeSession: Session | null = null): void {
    this.showForm({
      getProps: () => ({ activeSession }),
      listeners: {
        createSession: this.createSession,
      },
    });
  }

  createSession(): void {
    createDialog({
      title: 'Create session',
      dark: true,
      ok: 'Create',
      cancel: 'Cancel',
      prompt: {
        model: '',
        type: 'text',
      },
    })
      .onOk((name) => {
        const session = {
          name,
          id: shortid.generate(),
          hidden: false,
          start: null,
          end: null,
          graphCfg: {
            layout: { title: name },
            params: {},
            targets: [],
            renames: {},
            axes: {},
            colors: {},
          },
          notes: '',
        };
        this.saveConfig({
          ...this.widgetConfig,
          sessions: [...this.widgetConfig.sessions, session],
        });
        this.openModal(session);
      });
  }
}
</script>

<template>
  <q-card dark class="text-white scroll">
    <BlockGraph
      v-if="graphSession"
      :id="`${widget.id}::${graphSession.id}`"
      :value="true"
      :config="graphSession.graphCfg"
      no-duration
      @update:config="v => { graphSession.graphCfg = v; saveConfig(widgetConfig); }"
      @input="v => {if(!v) graphSessionId = null;}"
    />

    <WidgetToolbar :title="widget.title" :subtitle="displayName">
      <q-item-section side>
        <q-btn-dropdown flat split icon="settings" @click="openModal">
          <q-list dark bordered>
            <WidgetActions :crud="crud" />
          </q-list>
        </q-btn-dropdown>
      </q-item-section>
    </WidgetToolbar>

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <q-input v-model="sessionFilter" placeholder="Search Session" clearable dark>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section side>
          <q-btn flat rounded icon="add" label="New" class="text-white" @click="createSession" />
        </q-item-section>
      </q-item>
      <q-item v-for="session in sessions" :key="session.id" dark>
        <q-item-section>
          {{ session.name }}
          <q-item-label caption>
            {{ periodString(session) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat rounded icon="settings" @click="openModal(session)" />
        </q-item-section>
        <q-item-section side>
          <q-btn flat rounded icon="mdi-chart-line" @click="graphSessionId = session.id" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
