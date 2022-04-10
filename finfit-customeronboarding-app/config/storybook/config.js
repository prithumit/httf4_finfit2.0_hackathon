/* eslint-disable import/no-extraneous-dependencies */
import { configure } from '@storybook/vue';
import Vue from 'vue';
import Vuetify from 'vuetify';
import colorMixin from '@/_core/mixins/colorMixin';

Vue.mixin(colorMixin);
Vue.use(Vuetify);

const req = require.context('../../src/stories', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
