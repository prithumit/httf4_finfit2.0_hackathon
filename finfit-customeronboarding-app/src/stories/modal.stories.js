/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import vuetify from '@/plugins/vuetify';
import Modal from '../components/DCO-Modal/Modal.vue';

export const methods = {
  handleSave: action('Emitted save on Modal Data'),
  handleCancel: action('Emitted cancel on Modal Data'),
};

storiesOf('DCO-Modal', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add('with Modal component', () => ({
    components: { Modal },
    props: {
      config: {
        default: object('data', {
          enabled: true,
          title: 'Sample Modal',
          values: ['Sample', 'Text'],
          saveButton: 'Save',
          cancelButton: 'Cancel',
          width: '500px',
        }),
      },
    },
    template: '<Modal :config="config" @save="handleSave" @cancel="handleCancel"></Modal>',
    methods,
  }), {
    notes: ` config prop accepts five data:\n
            name for modal button name\n
            title for modal dialog title\n
            values for modal data\n
            saveButton for save button name\n
            cancelButton for cancel button name\n
            modalContent slot displays component\n`,
  });
