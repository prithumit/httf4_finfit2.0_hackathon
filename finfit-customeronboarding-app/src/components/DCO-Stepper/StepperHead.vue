<template>
  <div class="stepperHead">
    <v-stepper-step
      :color="primaryColor"
      :complete="config.stepperState > config.index"
      :step="config.index + 1"
      class="pl-2"
    >
      <span class="text-center ml-1 stepperHead--label" style="">
        {{ config.step.label }}
      </span>
    </v-stepper-step>
    <!-- <v-divider
      v-if="!config.isVertical && Boolean(config.index)"
      class="stepperHead--horizontalDivider"
    /> -->
  </div>
</template>

<script>
import '@/_styles/components/stepperHead.scss';

export default {
  name: 'stepper-head',
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
