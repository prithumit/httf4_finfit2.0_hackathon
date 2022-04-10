/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/vueI18n';
import FileUpload from '../components/DCO-Form/FileUpload.vue';

export const methods = {
  setData: action('Emitted upload event on file change'),
};

storiesOf('DCO-FileUpload', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    i18n,
    template: '<v-app><story/></v-app>',
  }))
  .add('with FileUpload component', () => ({
    components: { FileUpload },
    props: {
      enable: {
        default: true,
      },
    },
    data() {
      return {
      };
    },
    template: '<FileUpload @upload="setData"></FileUpload>',
    methods,
  }), {
    notes: 'File upload component',
  });
