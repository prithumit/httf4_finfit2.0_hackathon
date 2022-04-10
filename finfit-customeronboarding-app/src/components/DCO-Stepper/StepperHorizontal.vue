<template>
  <div>
    <v-stepper-header>
      <StepperHead
        v-for="(step, index) in config.steps"
        :config="{ step, index, 'stepperState': index }"
        :key="index"
      />
    </v-stepper-header>
  </div>
</template>

<script>
import StepperHead from '@/components/DCO-Stepper/StepperHead.vue';

export default {
  name: 'stepper-horizontal-header',
  components: {
    StepperHead,
  },
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
