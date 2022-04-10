<template>
  <v-content>
    <div v-if="config.isEnabled">
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header
            class="pt-2 expansion__panel-header"
          >
            <font
              class="font-weight-regular subtitle-1"
              :color="primaryColor"
            >{{config.label}}</font>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="expansion__content">
            <slot name="expandContent" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else>
        <slot name="expandContent" />
    </div>
  </v-content>
</template>

<script>
import '@/_styles/components/expansionPanel.scss';

export default {
  name: 'expansion-panel',
  props: {
    config: Object,
    deafult: undefined,
  },
  data: () => ({
    panel: [0],
  }),
};
</script>
