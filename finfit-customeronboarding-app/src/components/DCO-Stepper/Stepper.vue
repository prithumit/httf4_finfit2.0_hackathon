<template>
  <div class="stepper">
    <slot name="header"></slot>
    <v-stepper-items>
    <v-stepper-content :step="config.index + 1" class="pt-0 px-0">
        <slot name="content"></slot>
    </v-stepper-content>
    </v-stepper-items>
    <vr
      v-if="config.settings.isMobileDevice && isVerticalDivider(config)"
      role="separator"
      aria-orientation="vertical"
    />
  </div>
</template>

<script>
import '@/_styles/components/stepper.scss';

export default {
  name: 'Stepper',
  data() {
    return {
      stepper: 1,
    };
  },
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    isVerticalDivider: ({ stepsNo, index }) => index !== stepsNo - 1,
  },
};
</script>
<style>
.theme--light.v-stepper, .v-stepper__header {
    box-shadow: none;
}
</style>
