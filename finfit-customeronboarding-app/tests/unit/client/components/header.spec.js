/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  createLocalVue,
  mount,
} from '@vue/test-utils';
import VueRouter from 'vue-router';
import { i18n } from '@/plugins/vueI18n';
import Header from '@/pages/_common/Header.vue';
import events from '@/_core/helpers/event';
import router from '@/_core/router';

describe('Header component', () => {
  const localVue = createLocalVue();
  let wrapper;
  let vuetify;
  localVue.use(VueRouter);
  localVue.use(Vuetify);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Header, {
      localVue,
      vuetify,
      i18n,
      router,
      propsData: {
        headerConfig: {
          showDrawerButton: true,
          showLogoutButton: true,
          default: {}
        },
      },
      data() {
        return {
          headerLogoutIcon: true,
        };
      },
      mocks: {
        $appSettings: {
          applicationSettings: {
            applicationName: 'Digital Customer Onboarding',
          },
        },
      },
    });
    events.$emit('Hide_header_logo', true);
  });

  it('is mounted', () => {
    expect(wrapper.is(Header)).toBe(true);
  });

  it('triggers logoutConfirm method', () => {
    wrapper.vm.addSteps();
    expect(events.$on('add_step')).toBeTruthy();
  });

  it('triggers toggleDrawer method', () => {
    wrapper.vm.toggleDrawer();
    expect(events.$on('APP_DRAWER_TOGGLED')).toBeTruthy();
  });

  it('triggers handleFullScreen method for requestFullScreen', () => {
    const requestFullScreen = {
      call: jest.fn().mockReturnValue(Promise.resolve({}))
    }
    wrapper.vm.handleFullScreen();
  });

  it('triggers handleFullScreen method for cancelFullScreen', () => {
    const cancelFullScreen = {
      call: jest.fn().mockReturnValue(Promise.resolve({}))
    }
    wrapper.vm.handleFullScreen();
  });

  it('triggers logout method', () => {
    wrapper.vm.logout();
    expect(wrapper.vm.$route.path).toBe('/');
  });

  it('triggers logoutConfirm method', () => {
    wrapper.vm.logoutConfirm();
    expect(wrapper.vm.modalConfig.enabled).toBe(true);
  });
});
