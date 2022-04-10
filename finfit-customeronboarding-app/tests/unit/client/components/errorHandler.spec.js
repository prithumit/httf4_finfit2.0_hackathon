/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  createLocalVue,
  mount,
} from '@vue/test-utils';
import VueRouter from 'vue-router';
import { i18n } from '@/plugins/vueI18n';
import ErrorHandler from '@/components/DCO-ErrorHandler/ErrorHandler.vue';

describe('ErrorHandler component', () => {
  const localVue = createLocalVue();
  let vuetify;
  let wrapper;

  localVue.use(Vuetify);
  localVue.use(VueRouter);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ErrorHandler, {
      localVue,
      vuetify,
      i18n,
      propsData: {
        config: {
          content: 'This is a sample error message',
          type: 'error',
          component: 'dco-snackbar',
        },
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(ErrorHandler)).toBe(true);
  });

  it('loads modal component when passed config', () => {
    wrapper.setProps({
      config: {
        content: 'This is a sample error message in Dialog',
        type: 'error',
        component: 'dco-modal',
      },
    });
    expect(wrapper.find('.v-dialog__container').exists()).toBe(false);
  });

  it('loads snackbar component when passed config', () => {
    wrapper.setProps({
      config: {
        content: 'This is a sample error message in Snackbar',
        type: 'error',
        component: 'dco-snackbar',
      },
    });
    expect(wrapper.find('.v-snack').exists()).toBe(true);
  });
});
