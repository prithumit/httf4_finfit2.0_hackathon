/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { clipperBasic } from 'vuejs-clipper';
import vuetify from '@/plugins/vuetify';
import Clipper from '../components/DCO-Camera/Clipper.vue';

export const methods = {
  recievedClippedImage: action('Emitted image on Modal Data'),
  changeModalTitle: action('Emitted title on Modal Data'),
};

storiesOf('DCO-Clipper', module)
  .addDecorator(withKnobs({
    escapeHTML: false,
  }))
  .addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))
  .add('with Clipper component', () => ({
    components: { Clipper, clipperBasic },
    props: {
      config: {},
    },
    template: `<Clipper
        @clippedImage="recievedClippedImage"
        :config="{ image: 'https://www.finastra.com/themes/custom/kickstart/logo.png', isActive: false }"
        :sentImage="changeModalTitle"
        slot="modalContent"
        ref="clipper"></Clipper>`,
    methods,
  }), {
    notes: `config prop accepts two data:\n
            image for display\n
            isActive for indicating the image active state\n`,
  });
