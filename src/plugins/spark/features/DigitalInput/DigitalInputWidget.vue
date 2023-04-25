<script lang="ts">
import { useContext } from '@/composables';
import { useBlockWidget } from '@/plugins/spark/composables';
import { setExclusiveChannelActuator } from '@/plugins/spark/utils/configuration';
import { prettyQty } from '@/utils/quantity';
import { ChannelCapabilities, DigitalInputBlock } from 'brewblox-proto/ts';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DigitalInputWidget',
  setup() {
    const { inDialog, context } = useContext.setup();
    const { serviceId, block, patchBlock, isClaimed } =
      useBlockWidget.setup<DigitalInputBlock>();

    return {
      prettyQty,
      ChannelCapabilities,
      inDialog,
      context,
      serviceId,
      block,
      patchBlock,
      isClaimed,
      setExclusiveChannelActuator,
    };
  },
});
</script>

<template>
  <PreviewCard :enabled="inDialog">
    <template #preview>
      <BlockHistoryGraph />
    </template>

    <template #toolbar>
      <BlockWidgetToolbar has-mode-toggle />
    </template>

    <div>
      <CardWarning v-if="!block.data.hwDevice.id || !block.data.channel">
        <template #message>
          <span>Digital Input has no channel selected.</span>
        </template>
      </CardWarning>

      <div class="widget-body row">
        <LabeledField
          class="col"
          tag-class="full-width row justify-center"
        >
          <DigitalStateButton
            :model-value="block.data.state"
            :disable="true"
            class="col-auto"
          />
        </LabeledField>

        <template v-if="context.mode === 'Full'">
          <div class="col-break" />

          <ChannelSelectField
            :model-value="{
              hwDevice: block.data.hwDevice,
              channel: block.data.channel,
            }"
            :service-id="serviceId"
            :capabilities="ChannelCapabilities.CHAN_SUPPORTS_DIGITAL_INPUT"
            clearable
            title="Target channel"
            label="Channel"
            class="col-grow"
            @update:model-value="
              ({ hwDevice, channel }) =>
                setExclusiveChannelActuator(block, hwDevice, channel)
            "
          />
        </template>

        <div class="col-break" />

        <ClaimIndicator
          :block-id="block.id"
          :service-id="serviceId"
          class="col-grow"
        />
      </div>
    </div>
  </PreviewCard>
</template>
