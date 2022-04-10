import Vuetify from 'vuetify';
import {
  mount,
  createLocalVue,
} from '@vue/test-utils';

import RadialProgressBar from 'vue-radial-progress';
import StepperRadial from '@/components/DCO-Stepper/StepperRadial.vue';
import { stepsSchemaWithForm } from '../../../../mocks';

describe('StepperRadial', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(Vuetify);
  localVue.use(RadialProgressBar);

  beforeEach(() => {
    wrapper = mount(StepperRadial, {
      localVue,
      propsData: {},
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(StepperRadial)).toBe(true);
  });

  it('renders radial-stepper when props is valid', () => {
    wrapper.setProps({
      config: {
        steps: stepsSchemaWithForm.steps,
        state: stepsSchemaWithForm.steps[1].id,
      },
    });
    expect(wrapper.find(StepperRadial).exists()).toBe(true);
  });

  it('renders title and next button on existence of next step', () => {
    wrapper.setProps({
      config: {
        steps: stepsSchemaWithForm.steps,
        state: stepsSchemaWithForm.steps[1].id,
      },
    });
    expect(wrapper.find('font').exists()).toBe(true);
  });
});
