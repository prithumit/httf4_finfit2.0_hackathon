<template>
    <v-card-title v-if="config.steps" class="pa-0 ma-0" id="stepper-radial">
     <v-flex xs3 sm2 md2 lg3 xl3 class="pl-4 mt-1 pb-0">
        <template>
          <radial-progress-bar
            :diameter="70"
            :completed-steps="config.state"
            :total-steps="config.steps.length"
            :animateSpeed="900"
            startColor="green"
            stopColor="green"
            innerStrokeColor="#D3D3D3"
            :strokeWidth="6"
          >
            <font class="subtitle-1 font-weight-bold">{{config.state}} of {{config.steps.length}}</font>
          </radial-progress-bar>
        </template>
      </v-flex>
      <v-flex class="pl-4 mt-1" xs9 sm9 md9 lg9 xl9>
          <div
            v-for="(step, index) in config.steps"
            v-if="step.enabled"
            :key="index"
          >
            <font
              v-if="isNextStepperState(index, config.state)"
              :color="primaryColor"
              class="title font-weight-bold"
            >{{ step.label }}</font>
            <font
              v-if="isCurrentState(index, config.state)"
              :color="primaryColor"
              class="subtitle-1 ma-0 text-xs-right"
            >Next: {{ step.label }}</font>
        </div>
      </v-flex>
    </v-card-title>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress';
import '@/_styles/components/stepperRadial.scss';

export default {
  name: 'step-radial-head',
  components: {
    RadialProgressBar,
  },
  props: {
    config: {
      type: Object,
      default() {
        const steps = [];
        const state = 0;
        return {
          steps,
          state,
        };
      },
    },
  },
  methods: {
    isNextStepperState: (index, stepperState) => stepperState === index + 1,
    isCurrentState: (index, stepperState) => index === stepperState,
  },
};
</script>
