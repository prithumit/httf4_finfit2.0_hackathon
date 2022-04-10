/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  mount,
  createLocalVue,
} from '@vue/test-utils';
import events from "@/_core/helpers/event";
import { i18n } from '@/plugins/vueI18n';
import appSettings from '@/plugins/appSettings';
import CreateCredentials from '@/components/DCO-Credentials/CreateCredentials.vue';

describe('CreateCredentials component', () => {
  let wrapper;
  const vuetify = new Vuetify();
  const localVue = createLocalVue();
  localVue.use(Vuetify);
  localVue.use(appSettings);
  beforeEach(() => {
    wrapper = mount(CreateCredentials, {
      localVue,
      vuetify,
      i18n,
      mocks: {
        $appSettings: appSettings,
      },
      appSettings,
    });

    wrapper.setData({
      valid: true,
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(CreateCredentials)).toBe(true);
  });

  it('validates Password', () => {
    expect(wrapper.vm.validatePassword());
  });

  it('validates ConfirmPassword', () => {
    expect(wrapper.vm.validateConfirmPassword());
  });

  it('calls comparePassword() - throws error when entered password doesnot match with confirmPassword', () => {
    wrapper.setData({
      userLoginId: 'testUserId',
      mismatched: true,
      password: 'Abc@123',
      confirmPassword: 'Abc',
    });

    wrapper.trigger('input');
    wrapper.vm.comparePassword();

    expect(wrapper.vm.mismatched).toEqual(true);
  });

  it('calls comparePassword() - when entered password match with confirmPassword', () => {
    wrapper.setData({
      userLoginId: 'testUserId',
      mismatched: true,
      password: 'Qa1$uiuytyu',
      confirmPassword: 'Qa1$uiuytyu',
    });

    wrapper.trigger('input');
    wrapper.vm.comparePassword();
    wrapper.vm.validatePassword = jest.fn().mockReturnValue(true);
    wrapper.vm.isMatched = jest.fn().mockReturnValue(true);
    wrapper.vm.isNotEmpty = jest.fn().mockReturnValue(true);



    expect(events.$on('validForm')).toBeTruthy();
  });
});
