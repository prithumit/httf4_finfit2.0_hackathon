/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, object } from '@storybook/addon-knobs';
import vuetify from '@/plugins/vuetify';
import ExpansionPanel from '../components/DCO-ExpansionPanel/ExpansionPanel.vue';

storiesOf('DCO-ExpansionPanel', module)
  .addDecorator(
    withKnobs({
      escapeHTML: false,
    }),
  )
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add(
    'with ExpansionPanel component',
    () => ({
      components: { ExpansionPanel },
      props: {
        config: {
          default: object('data', {
            isEnabled: true,
            label: 'Sample Expansion Panel',
          }),
        },
      },
      template:
        '<ExpansionPanel :config="config"><v-text-field slot="expandContent" label="First Name"/></ExpansionPanel>',
    }),
    {
      notes: ` config prop accepts two properties:\n
                isEnabled boolean value\n
                label for expanison panel title\n`,
    },
  );
