import Vuetify from 'vuetify';
import { mount, createLocalVue } from '@vue/test-utils';
import { i18n } from '@/plugins/vueI18n';
import Vuex from 'vuex';
import appSettings from '@/plugins/appSettings';
import CommonService from '@/_core/services/commonService.js';
import store from '@/_core/store';
import ReviewAndConsent from '@/pages/ReviewAndConsent/ReviewDetailsAndConsent.vue';

describe('Review And Consent', () => {
  let vuetify;
  let wrapper;
  const localVue = createLocalVue();
  const schema = {
    type: 'text',
    'data-qa': 'townOrCity',
    preview: {
      purge: true,
    },
    flex: {},
  };
  const propsData = {
    emailAddress: 'a@g.com',
    phoneNumber: '0044 01234 568900',
    firstName: 's',
    lastName: 's',
    dateOfBirth: '1977-05-11',
    identificationType: 'Passport',
    identificationId: 's',
    applicationStatus: 'DRAFT',
    state: 3,
    customerId: 'AGF386',
    postCode: 'ssss',
    houseNumber: '',
    houseName: '',
    subBuilding: '',
    streetName1: '',
    streetName2: '',
    streetAddress: '',
    city: '',
    county: '',
    poBox: '',
    district: '',
    country: '',
    sortcode: 'ssssss',
    accountNumber: 'qqqqqqqqq',
    nationalInsuranceNumber: 'qqqq',
    countryOfTaxResidence: 'United Kingdom',
    citizenOfUS: true,
    taxResidentInUS: true,
    usTinNumber: 'tin123',
    termUnit: 'M',
    componentSchema: {
      steps: [
        {
          id: 1,
          label: 'Personal Details',
          completed: false,
          desc: 'Description',
          enabled: false,
          preview: {
            enabled: true,
          },
          mandatory: false,
          locale: 'en_US',
          component: [
            {
              name: 'PhotoCapture',
              label: 'PhotoCapture',
              schemaName: '',
              validation: true,
              validationLabel: 'Enable validation',
            },
            {
              name: 'Form',
              label: 'Personal Details',
              icon: 'mdi-account-circle',
              schemaName: 'PersonalDetails',
              validation: true,
              validationLabel: 'Enable validation',
            },
          ],
        },
      ],
    },
  };
  localVue.use(Vuetify);
  localVue.use(Vuex)

  beforeEach(() => {
    let store;

    vuetify = new Vuetify();
    CommonService.getProductDetails = jest.fn().mockReturnValue({});
    store = new Vuex.Store({});
    wrapper = mount(ReviewAndConsent, {
      localVue,
      store,
      vuetify,
      i18n,
      mocks: {
        $appSettings: appSettings,
      },
      propsData: {
        config: { componentConfig: { model: propsData, store: propsData } },
      },
      setData: {
        declarationAndConsent: appSettings.consentDeclarationContents,
        productDetails: {},
      },
    });
  });

  it('is mounted', () => {
    const wrapper = mount(ReviewAndConsent, {
      localVue,
      vuetify,
      i18n,
      mocks: {
        $appSettings: appSettings,
      },
      propsData: {
        config: { componentConfig: { model: propsData, store: propsData } },
      },
    });
    expect(wrapper.is(ReviewAndConsent)).toBe(true);
  });

  it('handleConsent method calls when checkbox not checked', () => {
    const button = wrapper.find('.review-container__consent-check');
    const spy = jest.fn();

    wrapper.vm.declarationAndConsent = appSettings.consentDeclarationContents;
    wrapper.vm.handleConsent({ index: 1, key: 'productTermsAcceptedFlag' }, true);
    wrapper.vm.$on('validForm', spy);
    button.trigger('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('call findItemValue()', () => {
    const data = {
      items: ['United Kingdom', 'Canada', 'India'],
      name: 'United Kingdom',
    };
    wrapper.vm.findItemValue(data.items, data.name);
    expect(wrapper.vm.isVisible(schema)).toBe(false);
  });

  it('call formatData()', () => {
    const date = '12-01-1970';

    expect(wrapper.vm.formatData(date, 'date')).toEqual('12 - 01 - 1970');
  });

  it('call formatData and addFormat', () => {
    expect(wrapper.vm.addFormat('PTY0001')).toEqual('PTY0001, ');
    expect(wrapper.vm.formatPhoneNumber('441234567890')).toEqual('12 4567890');
  });

  it('call formatData and addFormat', () => {
    expect(wrapper.vm.getClass(schema)).toEqual(' col-xs-12 col-md-4 col-sm-4');
  });

  it('call isSchemaActive()', () => {
    const param = { name: 'testName', schemaName: 'testSchema', validation: false };

    wrapper.vm.failedStepObj = false;
    CommonService.getComponentSchema = jest.fn('name', 'schemaName', 'validation').mockReturnValue({
      response: {}
    });
    wrapper.vm.isSchemaActive(param);
    expect(wrapper.vm.failedStepObj).toEqual(false);
  });

  it('call editInline() with editEnabled', () => {
    const spy = jest.fn();

    store.dispatch('userStore/setUserData', {});
    wrapper.vm.isEditEnabled = true;
    wrapper.vm.processInputData = jest.fn().mockReturnValue(true);
    wrapper.vm.editInline();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // it('call processInputData() with editEnabled', () => {
  //   const spy = jest.fn();

  //   store.dispatch('userStore/setUserData', {});
  //   wrapper.vm.isEditEnabled = true;
  //   wrapper.vm.processInputData('testType', 'testData');
  //   expect(spy).toHaveBeenCalledTimes(0);
  // });
});
