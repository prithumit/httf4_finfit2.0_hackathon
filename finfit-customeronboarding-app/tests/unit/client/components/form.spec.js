/* eslint-disable import/named */
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { i18n } from '@/plugins/vueI18n';
import Form from '@/components/DCO-Form/Form.vue';
import events from "@/_core/helpers/event";
import appSettings from '@/plugins/appSettings';
import { stepConfig, formConfig } from '../../../../mocks/index';

const VueToastStub = {
  render: () => {},
  methods: {
    validate: () => {},
  },
};

describe('Form component', () => {
  let wrapper;
  let vuetify;
  const localVue = createLocalVue();
  localVue.use(Vuetify);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(Form, {
      localVue,
      vuetify,
      i18n,
      mocks: {
        $appSettings: appSettings,
      },
      data() {
        return {
          arg: stepConfig,
        };
      },
      propsData: {
        config: formConfig,
      },
      stubs: {
        'v-form': VueToastStub,
      },
    });
    events.$emit('loadForm', stepConfig);
    events.$emit('response', { valid: true });
  });

  it('is mounted', () => {
    wrapper = shallowMount(Form, {
      localVue,
      vuetify,
      data() {
        return {
          arg: stepConfig,
        };
      },
      mocks: {
        $appSettings: appSettings,
      },
      propsData: {
        config: formConfig,
      },
    });
    events.$emit('loadForm', stepConfig);
    expect(wrapper.is(Form)).toBe(true);
  });

  it('triggers formValid method', () => {
    wrapper.vm.isFormValid({ on: 'focus' });
    wrapper.setData({ valid: true });
    events.$on('validForm', (arg) => {
      expect(arg).toBe(true);
    });
  });

  it('triggers getType method', () => {
    wrapper.vm.getType({ obj: { schema: { key: 'firstName', componentKeyEnable: 'firstName' } } });
    expect(wrapper.vm.key).toEqual('firstName');
  });

  it('triggers handleInput method with array values', () => {
    const schema = {
      buildingNumber: {
        type: 'text',
        label: 'House Number',
        color: 'primaryColor',
        'conditional-mandate-disable': 'line1',
        'data-relation-rules': ['required'],
        flex: {
          xs: 12,
        },
        rules: ['required'],
      },
    };
    wrapper.vm.toggleEnable = jest.fn().mockReturnValue(true);
    wrapper.vm.toggleManual = jest.fn().mockReturnValue(true);
    wrapper.vm.handleInput({ schema });
    wrapper.vm.valid = true;
  });

  it('triggers onFieldClick method with object values', () => {
    wrapper.vm.onFieldClick({
      data: {
        key: 'dateOfBirth',
        applicationStatus: 'DRAFT',
      },
      obj: {
        key: 'dateOfBirth',
        schema: {
          type: 'calendar',
          'data-type': 'firstName',
          componentKeyEnable: 'firstName',
          label: 'Date of Birth',
          value: '2019-01-01',
          'trigger-length': 6,
        },
      },
    });
    expect(wrapper.emitted('update')).toBeTruthy();
  });

  it('triggers onFieldChange method with array values', () => {
    wrapper.vm.onFieldChange({
      data: {
        key: 'dateOfBirth',
        applicationStatus: 'DRAFT',
      },
      obj: {
        key: 'dateOfBirth',
        schema: {
          type: 'calendar',
          'data-type': 'firstName',
          componentKeyEnable: 'firstName',
          label: 'Date of Birth',
          value: '2019-01-01',
          'trigger-length': 6,
        },
      },
    });
    expect(wrapper.emitted('update')).toBeTruthy();
  });


  // it('triggers onBlur method with schema', () => {
  //   wrapper = shallowMount(Form, {
  //     localVue,
  //     vuetify,
  //     data() {
  //       return {
  //         arg: stepConfig,
  //       };
  //     },
  //     mocks: {
  //       $appSettings: appSettings,
  //     },
  //     propsData: {
  //       config: {
  //         componentConfig: {
  //           store: {
  //             isMobile: false,
  //           },
  //         },
  //       },
  //     },
  //   });

  //   wrapper.vm.onBlur({
  //     data: {
  //       key: 'dateOfBirth',
  //     },
  //     key: 'dateOfBirth',
  //     on: 'blur',
  //     obj: {
  //       key: 'dateOfBirth',
  //       schema: {
  //         type: 'calendar',
  //         'data-type': 'firstName',
  //         componentKeyEnable: 'firstName',
  //         label: 'Date of Birth',
  //         value: '2019-01-01',
  //         'trigger-length': 6,
  //       },
  //     },
  //   });
  //   expect(wrapper.emitted('isValid')).toBeTruthy();
  // });

  it('should emit event getConfig', () => {
    wrapper.vm.getConfig('DRAFT');
    expect(wrapper.emitted('getConfig')).toBeTruthy();
  });

  it('should trigger dropdown()', () => {
    const inputParam = {
      data: {},
      obj: { key: 'test', schema: {}, value: '123' }
    };
    wrapper.vm.dropdown(inputParam);
  });
});
