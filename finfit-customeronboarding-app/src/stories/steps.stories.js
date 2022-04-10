/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, Array } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import vuetify from '@/plugins/vuetify';
import Steps from '@/admin/components/Step.vue';
import PersonalDetails from '@/admin/pages/PersonalDetails.vue';

storiesOf('DCO-Step', module)
  .addDecorator(
    withKnobs({
      escapeHTML: false,
    }),
  )
  .addDecorator(
    StoryRouter(
      {},
      {
        routes: [{ path: '/personalDetails', component: PersonalDetails }],
      },
    ),
  )
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add(
    'Add new step',
    () => ({
      components: {
        Steps,
      },
      props: {
        stepCards: Array,
      },
      created() {
        this.stepCards = [
          {
            label: 'PersonalDetails',
            desc: 'Description',
            enabled: true,
            mandatory: true,
            icon: 'mdi-account-circle',
            buttonText: 'Configure',
            route: 'PersonalDetails',
            config: {
              locale: 'en_US',
              nextRoute: 'AddressDetails',
              animate: true,
              components: [{ name: 'form', label: 'Form' }, { name: 'stepper', label: 'Stepper' }],
              componentConfig: [
                {
                  name: 'Form',
                  validation: false,
                  validationLabel: 'Enable validation',
                  type: [
                    {
                      label: 'Horizontal',
                      name: 'horizontal',
                    },
                  ],
                },
                {
                  name: 'Stepper',
                  orientaion: [
                    {
                      label: 'Horizontal',
                      name: 'horizontal',
                    },
                    {
                      label: 'Radial',
                      name: 'radial',
                    },
                  ],
                },
              ],
            },
          },
        ];
      },

      template: '<div><Steps :stepCards="stepCards"/>  <router-view/></div>',
    }),
    {
      notes: '',
    },
  );
