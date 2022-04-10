/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import vuetify from '@/plugins/vuetify';
import Camera from '@/components/DCO-Camera/Camera.vue';

export const methods = {
  recievedImage: action('Emitted camera on Modal Data'),
};

storiesOf('DCO-Camera', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add('with Camera component', () => ({

    components: { Camera },
    template: '<Camera @blobURL="recievedImage"></Camera>',
    methods,
  }), {
    notes: `Camera used to capture an image\n
            capture-icon to capture an image\n
            retake-icon to capture an new image\n`,
  });
