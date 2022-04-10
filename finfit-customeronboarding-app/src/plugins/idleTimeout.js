import Vue from 'vue';
import IdleVue from 'idle-vue';
import Settings from '@/plugins/appSettings';

Vue.use(IdleVue, {
  eventEmitter: new Vue(),
  idleTime: Settings.defaultConfigurations.idleTimeoutInterval,
});

export default new Vue({
  data() {
    return {
      logoutConfirm: true,
    };
  },
  onIdle() {
    this.logoutConfirm = !this.logoutConfirm;
  },
});
