import { mapState } from 'vuex';
import CommonService from '@/_core/services/commonService';

const toastMixin = {
  data() {
    return {
      alertMessage: undefined,
      loaderEnabled: false,
    };
  },
  computed: {
    ...mapState('appSettings', ['config']),
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'appSettings/updateAppConfig') {
        this.loaderEnabled = state.appSettings.config.inProgress;
        if (state.appSettings.config.message) {
          this.alertMessage = state.appSettings.config.message;
        }
        // if (state.appSettings.config.expireSession) {
        //   this.revokeToken();
        // }
      }
    });
  },
  methods: {
    async revokeToken() {
      await CommonService.revokeToken();
    },
  },
};

export default toastMixin;
