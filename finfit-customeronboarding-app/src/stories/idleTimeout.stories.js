/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import Vue from 'vue';
import i18n from '@/plugins/vueI18n';
import idleTimeout from '@/plugins/idleTimeout';
import vuetify from '@/plugins/vuetify';
import IdleTimeout from '../components/DCO-IdleTimeout/IdleTimeout.vue';


Vue.prototype.$idleTimeouts = idleTimeout;
storiesOf('DCO-IdleTimeout', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(
    StoryRouter(
      {},
      {
        routes: [{ path: '/' }],
      },
    ),
  )
  .addDecorator(() => ({
    vuetify,
    i18n,
    template: '<v-app><story/></v-app>',
  }))
  .add('with IdleTimeout component', () => ({
    components: { IdleTimeout },
    data() {
      return {
        $idleTimeouts: {
          logoutConfirm: true,
        },
      };
    },
    template: '<IdleTimeout></IdleTimeout>',
  }), {
    notes: 'Display a dialog if the user hasn\'t interacted with the app for a while',
  });
