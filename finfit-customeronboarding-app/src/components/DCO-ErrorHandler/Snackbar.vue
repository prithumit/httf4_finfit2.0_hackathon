<template>
  <div class="snackbar">
    <v-snackbar
      v-model="config.enabled"
      :timeout="config.timeout"
      :color="config.color"
      :top="config.topPosition"
      :right="config.rightPosition"
      :bottom="config.bottomPosition"
      :left="config.leftPosition"
    >
      <span>
        <font class="snackbar__content-font-size">{{ config.content }}</font>
      </span>
      <v-btn
        @click="config.enabled = false"
        icon
        color="white"
        class="snackbarClose"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import '@/_styles/components/snackbar.scss';

export default {
  name: 'DCO-Snackbar',
  props: {
    config: {
      type: Object,
      default() {
        return {
          enabled: true,
          content: '',
          color: 'green',
          timeout: 4000,
          topPosition: true,
          rightPosition: true,
        };
      },
    },
  },
};
</script>
