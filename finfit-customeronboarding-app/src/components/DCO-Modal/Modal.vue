<template>
  <v-dialog
    v-model="config.enabled"
    :width="config.width"
    :persistent="config.persistent"
  >
    <v-card>
      <v-toolbar
        :color="secondaryColor"
        class="subtitle-1 white--text"
        max-height="50px"
      >
        <v-icon
           v-if="Boolean(config.icon)"
            @click="onCancel"
            class="pb-3"
            dark
        >{{config.icon}}</v-icon>
        <span class="pb-3">{{config.title}}</span>
        <v-spacer></v-spacer>
        <span class="pb-3">
          <v-icon
            v-if="config.close"
            @click="onCancel"
            dark
            class="close-btn"
          >mdi-close</v-icon>
        </span>
      </v-toolbar>
      <v-card-text class="pa-4">
        <slot name="modalContent"></slot>
        <font class="subtitle-1 font-weight-regular black--text" v-html="config.values"></font>
      </v-card-text>
      <v-divider v-if="(config.saveButton || config.cancelButton)"></v-divider>
      <v-card-actions
        v-if="(config.saveButton || config.cancelButton)"
        class="pa-2"
      >
        <v-spacer></v-spacer>
        <v-btn
          v-if="Boolean(config.saveButton)"
          @click="onSave"
          :color="secondaryColor"
          :disabled="config.enableSave"
          class="font-weight-light text-none save-btn"
          outlined
        >{{config.saveButton}}</v-btn>
        <v-btn
          v-if="Boolean(config.cancelButton)"
          @click="onCancel"
          :color="secondaryColor"
          :disabled="config.enableCancel"
          class="font-weight-light text-none cancel-btn"
          outlined
        >{{config.cancelButton}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DCO-Modal',
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    onSave() {
      this.$emit('save', true);
      if (this.config.saveCallback) {
        this.config.saveCallback();
      }
      this.config.enabled = false;
    },
    onCancel() {
      this.$emit('cancel', true);
      if (this.config.cancelCallback) {
        this.config.cancelCallback();
      }
      this.config.enabled = false;
    },
  },
};
</script>
