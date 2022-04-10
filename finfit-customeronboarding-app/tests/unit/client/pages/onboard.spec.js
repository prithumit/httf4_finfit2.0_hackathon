/* eslint-disable import/named */
import VueI18n from 'vue-i18n';
import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VueRouter from 'vue-router';
import { i18n } from '@/plugins/vueI18n';
import store from '@/_core/store';
import router from '@/_core/router/index.js';
import CommonService from '@/_core/services/commonService';
import Onboard from '@/pages/Onboard/Onboard.vue';

describe('Onboard page', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(VueI18n);
  localVue.use(VueRouter);

  const data = {
    steps:
      [
        {
          id: 1,
          label: "We'd like to get to know you",
          completed: false,
          component: {
            name: 'Form',
            descriptor: 'knowYou',
          },
        },
        {
          id: 2,
          label: 'Something more personal',
          completed: false,
          component: {
            name: 'Form',
            descriptor: 'knowYou',
          },
        },
        {
          id: 3,
          label: 'You are who you say you are',
          completed: false,
          component: {
            name: 'Form',
            descriptor: 'whoYou',
          },
        },
        {
          id: 3,
          label: 'We respect your privacy and preferences',
          completed: false,
          component: {
            name: 'Form',
            descriptor: 'privacyPref',
          },
        },
        {
          id: 3,
          label: 'Join the family',
          completed: false,
          component: {
            name: 'Form',
            descriptor: 'joinFamily',
          },
        },
      ],
    settings: {
      vertical: false,
    },
    isMobileDevice: false,
  };

  beforeEach(() => {
    wrapper = shallowMount(Onboard, {
      localVue,
      store,
      router,
      i18n,
    });

    const mockStepperConfig = () => new Promise({
      data: {
        steps:
          [
            {
              id: 1,
              label: "We'd like to get to know you",
              completed: false,
              component: {
                name: 'Form',
                descriptor: 'knowYou',
              },
            },
            {
              id: 2,
              label: 'Something more personal',
              completed: false,
              component: {
                name: 'Form',
                descriptor: 'knowYou',
              },
            },
            {
              id: 3,
              label: 'You are who you say you are',
              completed: false,
              component: {
                name: 'Form',
                descriptor: 'whoYou',
              },
            },
            {
              id: 3,
              label: 'We respect your privacy and preferences',
              completed: false,
              component: {
                name: 'Form',
                descriptor: 'privacyPref',
              },
            },
            {
              id: 3,
              label: 'Join the family',
              completed: false,
              component: {
                name: 'Form',
                descriptor: 'joinFamily',
              },
            },
          ],
        settings: {
          vertical: false,
        },
      },
    });

    const mockFormConfig = () => new Promise({
      data: {
        schema: [{
          id: 1,
          body: 'first notification',
          read: 'true',
        },
        {
          id: 2,
          body: 'second notification',
          read: 'false',
        },
        ],
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(Onboard)).toBe(true);
  });

  it('loads steps json onload', async () => {
    await flushPromises();
  });

  it('isMobileDevice', () => {
    wrapper.vm.wizardData = data;
    wrapper.vm.wizardData.settings.vertical = false;
    wrapper.vm.wizardData.settings.isMobileDevice = false;
    // const isMobileDevice = jest.fn().mockReturnValue(Promise.resolve(false));
    wrapper.vm.isMobileDevice();
    expect(wrapper.vm.wizardData.settings.isMobileDevice).toBe(false);
  });

  it('renders getComponentConfig()', () => {
    CommonService.getComponentConfig = jest.fn().mockReturnValue(Promise.resolve(true));
    wrapper.vm.wizardData = data;
    wrapper.vm.wizardData.settings.vertical = false;
    wrapper.vm.wizardData.settings.isMobileDevice = false;
    expect(wrapper.vm.wizardData.settings.isMobileDevice).toBe(false);
  });

  it('calls getComponentSchema()', () => {
    const componentName = 'Credentials';
    const formName = false;
    const validationState = true;
    CommonService.getComponentSchema = jest.fn(componentName, formName, validationState).mockReturnValue(Promise.resolve(true));
    wrapper.vm.getComponentSchema();
  });

  it('renders getComponentConfig() with data', () => {
    store.dispatch('userStore/setUserData', { data: 'test', lastUpdatedStepIdentifierIndex: 1, applicationStatus: 'DRAFT' });
    CommonService.getComponentSchema = jest.fn('Credentials', 'sampleName', 'validationState').mockReturnValue({
      model: {
        data: 'test'
      }
    });
    wrapper.vm.getComponentSchema();
    expect(CommonService.getComponentSchema).toHaveBeenCalledTimes(1);
  });

  it('renders handleWizardInput() truthy conditon', () => {
    store.dispatch('userStore/setUserData', { data: '123456789' });
    const userInput = {
      data: {},
      schemaName: 'testSchema'
    };
    wrapper.vm.handleWizardInput(userInput);
    expect(JSON.stringify(store.getters["userData/userData"])).toBe(JSON.stringify({
      "componentSchema": true,
      "testSchema": {},
    }));
  });

  it('renders handleWizardInput() falsy condition', () => {
    // store.dispatch('userStore/setUserData', { data: '123456789' });
    const userInput = {
      data: {
        applicationStatus: 'DRAFT'
      },
    };
    wrapper.vm.handleWizardInput(userInput);
    expect(JSON.stringify(store.getters["userData/userData"])).toBe(JSON.stringify({
      "componentSchema": true,
      "testSchema": {},
      "undefined": {},
      "applicationStatus": "DRAFT"
    }));
  });

  it('renders handleSave() without redirect on save', () => {
    const event = { flag: 'CONFIRM_ONBOARD', redirect: false, keyMap: [], init: 'test' };
    wrapper.vm.handleSave(event);
    const spy = jest.fn();
    wrapper.vm.$on('redirectOnConfirm', spy);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('renders handleSave() with redirect on save', () => {
    const event = { flag: 'CONFIRM_ONBOARD', redirect: true, keyMap: [], init: 'test' };
    wrapper.vm.handleSave(event);
  });

  it('renders handleSave() with CREATE APPLICATION', () => {
    const event = { flag: 'CREATE_APPLICATION', redirect: true, keyMap: [], init: 'test' };
    wrapper.vm.handleSave(event);
  });

  it('renders saveToAppData() with CREATE APPLICATION', () => {
    store.dispatch('userStore/setUserData', { data: '123456789' });
    CommonService.verifyAndCreateCustomer = jest.fn().mockReturnValue({
      response: {}
    });
    wrapper.vm.saveToAppData();
  });

  it('renders abortApplication()', () => {
    store.dispatch('userStore/setUserData', { test: '123456789' });
    CommonService.abortApplication = jest.fn().mockReturnValue({});
    wrapper.vm.abortApplication();
  });

  it('implements getComponentConfig()', () => {
    const components = {
      components: [
        {
          name: "Form",
          label: "Address Details",
          preview: {
            label: "Address Details"
          },
          size: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
          },
          icon: "mdi-map-marker",
          schemaName: "AddressDetails",
          validation: true,
          enabled: true,
          formValidation: true,
          validationLabel: "Enable validation"
        }
      ],
    };
    wrapper.vm.getComponentConfig(components);
    expect(wrapper.vm.inputSchema).toEqual("AddressDetails");
  });

  it('returns isMobileDevice active status', () => {
    store.getters['appSettings/config'].isMobile = false;
    expect(store.getters['appSettings/config'].isMobile).toEqual(false);
  });
});
