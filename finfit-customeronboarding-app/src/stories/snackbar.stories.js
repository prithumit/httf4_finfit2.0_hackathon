/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, object } from '@storybook/addon-knobs';
import vuetify from '@/plugins/vuetify';
import Snackbar from '../components/DCO-ErrorHandler/Snackbar.vue';

storiesOf('DCO-Snackbar', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add('with Snackbar component', () => ({
    components: { Snackbar },
    props: {
      config: {
        default: object('data', {
          snackbar: true,
          enabled: true,
          content: 'I\'m from storyBook',
          color: 'red',
          timeout: 2000,
          snackbarTopPosition: true,
        }),
      },
    },
    data() {
      return {
        snackbar: true,
        enabled: true,
        content: 'I\'m from storyBook',
        color: 'red',
        timeout: 6000,
        snackbarTopPosition: true,
      };
    },
    template: '<Snackbar v-if="config.snackbar" :config="config"></Snackbar>',
  }), {
    notes: `config prop accepts five data:\n
            snackbar for setting up the snackbar\n
            enabled for enabling the snackbar\n
            content for display of snackbar content\n
            color for snackbar color\n
            timeout for lifespan of the snackbar\n
            snackbarTopPosition for display snackbar in the top position of app\n`,
  });
