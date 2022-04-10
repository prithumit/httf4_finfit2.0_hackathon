/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, object } from '@storybook/addon-knobs';
import VFormBase from 'dco-vuetify-form';
import vuetify from '@/plugins/vuetify';

import Form from '../components/DCO-Form/Form.vue';

import {
  formSchema,
} from '../../mocks';

storiesOf('DCO-Form', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    VFormBase,
    template: '<v-app><story/></v-app>',
  }))
  .add('with sample schema', () => ({
    components: {
      Form,
      VFormBase,
    },
    props: {
      formData: {
        default: object('formData', formSchema),
      },
    },
    template: `<v-form-base
                  v-if="formData.schema"
                  :value="formData.model"
                  :schema="formData.schema"
              />`,
  }), {
    notes: '',
  });
