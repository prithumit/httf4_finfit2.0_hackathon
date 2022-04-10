import Vuetify from 'vuetify';
import {
  mount,
  createLocalVue,
} from '@vue/test-utils';

import StepperHorizontal from '@/components/DCO-Stepper/StepperHorizontal.vue';
import { stepsSchemaWithForm } from '../../../../mocks';

describe('StepperHorizontal', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(Vuetify);

  beforeEach(() => {
    wrapper = mount(StepperHorizontal, {
      localVue,
      propsData: {
        config: {},
      },
    });
  });

  it('is mounted', () => {
    wrapper = mount(StepperHorizontal, {
      localVue,
      propsData: {
        config: {
          steps: stepsSchemaWithForm.steps,
        },
      },
    });
    expect(wrapper.is(StepperHorizontal)).toBe(true);
  });

  it('is steps validation', () => {
    const stepperNo = stepsSchemaWithForm.steps.length;
    wrapper = mount(StepperHorizontal, {
      localVue,
      propsData: {
        config: {
          steps: stepsSchemaWithForm.steps,
        },
      },
    });
    expect(wrapper.findAll('.stepperHead').length).toBe(stepperNo);
  });
});
