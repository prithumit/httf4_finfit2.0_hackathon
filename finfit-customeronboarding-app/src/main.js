import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import { i18n } from '@/plugins/vueI18n';
import router from '@/_core/router';
import App from '@/App.vue';
import store from '@/_core/store';
import vuetify from '@/plugins/vuetify';
import idleTimeout from '@/plugins/idleTimeout';
import colorMixin from '@/_core/mixins/colorMixin';
import appSettings from '@/plugins/appSettings';

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
};

Vue.use(VueLogger, options);
Vue.prototype.$idleTimeouts = idleTimeout;
Vue.prototype.$appSettings = appSettings;
Vue.config.productionTip = false;
Vue.mixin(colorMixin);

new Vue({
  colorMixin,
  i18n,
  router,
  store,
  vuetify,
  appSettings,
  idleTimeout,
  render: h => h(App),
}).$mount('#app');
