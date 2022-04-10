/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  createLocalVue,
  mount,
} from '@vue/test-utils';
import VueRouter from 'vue-router';
import { i18n } from '@/plugins/vueI18n';
import idleTimeoutPlugin from '@/plugins/idleTimeout';
import IdleTimeout from '@/components/DCO-IdleTimeout/IdleTimeout.vue';
import router from '@/_core/router';

describe('IdleTimeout component', () => {
  const localVue = createLocalVue();
  let wrapper;
  let vuetify;
  localVue.use(Vuetify);
  localVue.use(VueRouter);
  localVue.use(idleTimeoutPlugin);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(IdleTimeout, {
      localVue,
      vuetify,
      i18n,
      router,
      mocks: {
        $idleTimeouts: {
          logoutConfirm: false,
        },
        $appSettings: {
          applicationSettings: {
            productsUrl: 'test_url',
          },
        },
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(IdleTimeout)).toBe(true);
  });

  it('routes to login page on inactive', () => {
    wrapper.vm.logout();
    expect(wrapper.vm.$route.name).toBe('dco');
  });

  it('popup the modal component on inactive', () => {
    wrapper.vm.idleVue_onIdle();
    expect(wrapper.vm.$idleTimeouts.logoutConfirm).toBe(false);
  });
});
