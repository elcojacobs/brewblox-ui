<script lang="ts">
import { Component } from 'vue-property-decorator';

import BlockCrudComponent from '@/plugins/spark/components/BlockCrudComponent';

import { MutexBlock } from './types';

@Component
export default class MutexForm extends BlockCrudComponent {
  readonly block!: MutexBlock;
}
</script>

<template>
  <q-card dark class="widget-modal">
    <BlockFormToolbar :crud="crud" />

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <p>
            Mutex is short for
            <b>Mut</b>ually
            <b>Ex</b>clusive.
          </p>
          <p>
            If you add a Mutex constraint to multiple digital actuators,
            they will never be active at the same time if they share the same Mutex block.
          </p>
          <p>
            This can be used to:
            <ul>
              <li>Prevent heating and cooling at the same time.</li>
              <li>Prevent two or more heating elements from exceeding your maximum available power.</li>
            </ul>
          </p>
          <p>
            The Mutex can also prevent switching between two actuators too quickly.<br />
            If you set the minimum idle time to 45 minutes,
            a heater can only go active after the cooler has been inactive for 45 minutes.<br />
            We recommend setting the idle time to 1.5x your longest PWM period.
          </p>
        </q-item-section>
      </q-item>
      <q-item dark>
        <q-item-section>
          <q-item-label caption>
            Minimum idle time before switching to a
            <i>different</i> actuator
          </q-item-label>
          <TimeUnitField
            :value="block.data.differentActuatorWait"
            title="Minimum idle time"
            @input="v => { block.data.differentActuatorWait = v; saveBlock(); }"
          />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
