<template>
  <v-flex xs2 sm2 md2 lg2 xl2>
    <dco-modal
      :config="config"
      @cancel="logout"
    >
      <span
        slot="modalContent"
        class="subheading font-weight-bold"
      >{{ $t('idleDialog.sessionExpire_message') }}</span>
    </dco-modal>
  </v-flex>
</template>
<script>
export default {
  name: 'dco-idle-timeout',
  components: {
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  data() {
    return {
      config: {
        enabled: false,
        persistent: true,
        title: '',
        icon: 'mdi-timer',
        cancelButton: '',
        width: 450,
      },
    };
  },
  methods: {
    logout() {
      // eslint-disable-next-line no-restricted-globals
      location.href = this.$appSettings.applicationSettings.productsUrl;
    },
  },
  onIdle() {
    this.config.enabled = true;
    this.config.title = this.$t('idleDialog.sessionExpire_title');
    this.config.cancelButton = this.$t('common.okay');
  },
};
</script>
