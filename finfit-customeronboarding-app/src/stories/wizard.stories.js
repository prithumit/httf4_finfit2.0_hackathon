/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, object } from '@storybook/addon-knobs';
import vuetify from '@/plugins/vuetify';

import Wizard from '../components/DCO-Wizard/Wizard.vue';
import StepperFooter from '../components/DCO-Stepper/StepperFooter.vue';

import {
  formSchema,
  stepsSchemaWithForm,
} from '../../mocks';

storiesOf('DCO-Wizard', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add('with Form component', () => ({
    components: { Wizard },
    props: {
      formData: {
        default: object('formData', formSchema),
      },
      wizardData: {
        default: object('wizardData', stepsSchemaWithForm),
      },
    },
    template: '<Wizard :wizardConfig="wizardData" :componentConfig="formData"></Wizard>',
  }), {
    notes: `wizardData prop accepts stepper info json\n
            formData prop accepts form schema\n`,
  })
  .add('with with footer component', () => ({
    components: { StepperFooter },
    props: {
      config: {
        default: object('config', { steps: stepsSchemaWithForm.steps, state: 1 }),
      },
    },
    template: '<StepperFooter :config="config"/>',
  }), {
    notes: '',
  });
