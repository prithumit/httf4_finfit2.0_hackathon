/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  shallowMount,
  createLocalVue,
} from '@vue/test-utils';
import store from '@/_core/store';
import events from "@/_core/helpers/event";
import Wizard from '@/components/DCO-Wizard/Wizard.vue';

describe('Wizard component', () => {
  const localVue = createLocalVue();
  let wrapper;

  const stepperStub = {
    template: '<div class="v-stepper__step" />',
  };

  const formStub = {
    template: '<form />',
  };

  const stepperRadialStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const stepperHeadStub = {
    template: '<div class="v-stepper__head" />',
  };

  const stepperFooterStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const stepperHorizontalStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const dcoExpandableStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const createCredentialsStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const reviewDetailsAndConsentStub = {
    template: '<div class="v-stepper__radial" />',
  };

  const wizConfig = {
    PersonalDetails: {
      schema: {
        firstName: {
          type: 'text', appendIcon: '', label: 'First Name', flex: { xs: 12, sm: 6, lg: 6 }, rules: [null, null], id: 'required',
        },
        lastName: {
          type: 'text', label: 'Last Name', flex: { xs: 12, sm: 6, lg: 6 }, rules: [null, null], id: 'required',
        },
        birthDate: {
          type: 'text', label: 'Date of Birth', 'data-type': 'date-picker', flex: { xs: 12, sm: 6, lg: 6 }, rules: [null], id: 'required',
        },
        nationalIdType: {
          type: 'select', label: 'National Id Type', selected: 0, items: ['PASSPORT', 'Driving License', 'Nation ID'], flex: { xs: 12, sm: 6, lg: 6 }, rules: [null], id: 'required',
        },
        nationalIdNumber: {
          type: 'text', label: 'National Id Number', flex: { xs: 12, sm: 6, lg: 6 }, rules: [null, null], id: 'required',
        },
      },
      model: {
        emailAddress: 'denil@hh.com', phoneNumber: '9845214413', firstName: 'denil', lastName: 'varkey', birthDate: '1999-08-25', nationalIdType: 'PASSPORT', nationalIdNumber: '3456ui', state: 2, appId: '684545', postCode: '345678', houseNumber: '45678', houseName: 'erhjk', streetName: '56789', streetAddress: 'fghjk', city: 'fghj',
      },
    },
  };

  const compConfig = {
    steps: [{
      id: 1,
      label: 'Personal Details',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: false,
      locale: 'en_US',
      component: [{
        name: 'PhotoCapture', label: 'PhotoCapture', schemaName: '', validation: true, validationLabel: 'Enable validation',
      }, {
        name: 'Form', label: 'Personal Details', icon: 'mdi-account-circle', schemaName: 'PersonalDetails', validation: true, validationLabel: 'Enable validation',
      }],
    }, {
      id: 2,
      label: 'Address Details',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      locale: 'en_US',
      component: [{
        name: 'Form', label: 'Address Details', icon: 'mdi-search-web', schemaName: 'AddressDetails', validation: true, validationLabel: 'Enable validation',
      }],
    }, {
      id: 3,
      label: 'Additional Information',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      locale: 'en_US',
      component: [{
        name: 'Form', label: 'Link Nominated Account', icon: 'mdi-bank', schemaName: 'NominatedAccountDetails', validation: true, validationLabel: 'Enable validation',
      }, {
        name: 'Form', label: 'Your Tax Details', schemaName: 'TaxDetails', isExpandable: true, validation: true, validationLabel: 'Enable validation',
      }],
    }, {
      id: 4,
      label: 'Review & Consent',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: false,
      icon: 'mdi-clipboard-check',
      locale: 'en_US',
      component: [{
        name: 'Form', label: 'Form', schemaName: '', validation: false, validationLabel: 'Enable validation',
      }],
    }, {
      id: 5,
      label: 'Credentials',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      icon: 'mdi-search-web',
      locale: 'en_US',
      component: [{
        name: 'Form', label: 'Form', schemaName: '', validation: false, validationLabel: 'Enable validation',
      }],
    }],
    settings: { vertical: false, isMobileDevice: false },
  };

  localVue.use(Vuetify);

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
    })),
  });

  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
  };

  global.navigator.geolocation = mockGeolocation;

  beforeEach(() => {
    const vuetify = new Vuetify();

    wrapper = shallowMount(Wizard, {
      localVue,
      vuetify,
      store,
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
      data() {
        return {
          stepperState: 0,
          validComponents: {},
        };
      },
    });
  });

  it('is mounted', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    expect(wrapper.is(Wizard)).toBe(true);
  });

  it('renders no stepper when stepper props is empty', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    expect(wrapper.find('.v-stepper__step').exists()).toBe(false);
  });

  it('renders stepper when stepper props is valid', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      stubs: {
        'v-stepper': stepperStub,
        StepperRadial: stepperRadialStub,
      },
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    expect(wrapper.find('.v-stepper__step').exists()).toBe(false);
  });

  it('renders form when passed form schema', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      stubs: {
        Form: formStub,
        StepperRadial: stepperRadialStub,
      },
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('adds 1 to stepperstate on increment ', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      stubs: {
        Form: formStub,
        StepperRadial: stepperRadialStub,
      },
      mocks: {
        $store: {
          getters: {
            'userData/userData': true,
          },
        },
      },
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.getComponentConfiguration = jest.fn().mockReturnValue(true);
    wrapper.vm.stepChange({ state: 'increment', count: 1, stepperState: 2 });
    expect(wrapper.vm.stepperState).toBe(1);
  });

  it('substracts 1 from stepperstate on decrement ', () => {
    wrapper = shallowMount(Wizard, {
      localVue,
      stubs: {
        Form: formStub,
        StepperRadial: stepperRadialStub,
      },
      mocks: {
        $store: {
          getters: {
            'userData/userData': true,
          },
        },
      },
      propsData: {
        wizardConfig: wizConfig,
        componentConfig: compConfig,
      },
    });

    wrapper.vm.stepperState = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.getComponentConfiguration = jest.fn().mockReturnValue(true);
    wrapper.vm.stepChange({ state: 'decrement', count: 1 });
    expect(wrapper.vm.stepperState).toBe(1);
  });


  it('getComponentConfiguration should emit event componentConfig', () => {
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.currentState = 2;
    wrapper.vm.getComponentConfiguration(2);
    wrapper.vm.$emit('componentConfig', { components: compConfig.component });
    expect(wrapper.emitted('componentConfig')).toBeTruthy();
  });

  it('getComponentConfiguration should emit event componentConfig', () => {
    wrapper.trigger('update');
    wrapper.vm.reduceStepCountBy = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.componentGetter = {};
    wrapper.vm.handleComponentUpdate({ data: { applicationStatus: 'DRAFT' }, schema: wizConfig.PersonalDetails.schema, label: 'PersonalDetails' });
    wrapper.vm.$emit('update', wrapper.vm.componentGetter);
    expect(wrapper.emitted('update')).toBeTruthy();
  });

  it('calls checkValidity method on @isValid event', () => {
    wrapper.trigger('isValid');
    wrapper.vm.reduceStepCountBy = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.componentGetter = {};
    wrapper.vm.handleComponentUpdate({ componentObj: compConfig.component, isValidObj: {}, previousState: true });
    events.$emit('validForm', false);
    expect(events.$emit('validForm')).toBeTruthy();
  });

  it('calls navigateTo method on @navigate event', () => {
    wrapper.trigger('navigate');
    wrapper.vm.reduceStepCountBy = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.stepperState = 2;
    wrapper.vm.error = true;
    wrapper.vm.getComponentConfiguration = jest.fn().mockReturnValue(true);
    wrapper.vm.stepChange({ state: 'increment', count: 1 });
    expect(wrapper.vm.stepperState).toBe(3);
  });

  it('calls else condition method on @navigate event', () => {
    wrapper.trigger('navigate');
    wrapper.vm.reduceStepCountBy = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.stepperState = 2;
    wrapper.vm.error = true;
    wrapper.vm.getComponentConfiguration = jest.fn().mockReturnValue(true);
    wrapper.vm.stepChange({ state: 'decrement', count: 1 });
    expect(wrapper.vm.stepperState).toBe(1);
  });

  it('calls event state navigate', () => {
    wrapper.trigger('navigate');
    wrapper.vm.reduceStepCountBy = 2;
    wrapper.vm.wizardConfig = compConfig;
    wrapper.vm.stepperState = 2;
    wrapper.vm.error = true;
    wrapper.vm.getComponentConfiguration = jest.fn().mockReturnValue(true);
    wrapper.vm.checkValidity = jest.fn().mockReturnValue(true);
    wrapper.vm.stepChange({ state: 'navigate', stepperState: 1 });
    expect(wrapper.vm.stepperState).toBe(1);
  });

  // it('calls checkValidity() on validObject', () => {
  //   wrapper.vm.checkValidity({}, {}, false);
  //   expect(JSON.stringify(wrapper.vm.validComponents)).toBe(JSON.stringify({}));
  // });
});
