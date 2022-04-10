import Vuetify from 'vuetify';
import { mount, createLocalVue } from '@vue/test-utils';
import { i18n } from '@/plugins/vueI18n';
import StepperFooter from '@/components/DCO-Stepper/StepperFooter.vue';
import events from "@/_core/helpers/event";
import { stepsSchemaWithForm } from '../../../../mocks';

describe('StepperFooter', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(Vuetify);

  beforeEach(() => {
    wrapper = mount(StepperFooter, {
      localVue,
      i18n,
      propsData: {
        config: {
          steps: stepsSchemaWithForm.steps,
          stepperState: stepsSchemaWithForm.steps[1].id,
          index: 1,
          applicationStatus: 'SIGNOFF',
        },
      },
      slots: {
        click: 'on',
      },
    });

    events.$emit('validForm', true);
  });

  it('is mounted', () => {
    expect(wrapper.is(StepperFooter)).toBe(true);
  });

  it('should emit an event decrement on click', () => {
    wrapper.setProps({
      config: {
        steps: stepsSchemaWithForm.steps,
        state: stepsSchemaWithForm.steps[1].id,
        index: 1,
      },
    });
    const button = wrapper.find('.decrement');
    const spy = jest.fn();

    wrapper.vm.$on('changeStepperIndex', spy);
    button.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit an event increment on click', () => {
    wrapper.setProps({
      config: {
        steps: stepsSchemaWithForm.steps,
        state: stepsSchemaWithForm.steps[1].id,
        index: 1,
        applicationStatus: 'SIGNOFF',
      },
    });

    const button = wrapper.find('.increment');
    const spy = jest.fn();

    wrapper.vm.$on('changeStepperIndex', spy);
    button.trigger('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should emit event continue', () => {
    wrapper.vm.execAfterLastStep();
    expect(wrapper.vm.isLastStep).toBe(true);
    expect(wrapper.emitted('continue')).toHaveLength(1);
  });

  it('should test watch', () => {
    wrapper.vm.$options.watch.error(true, false);
    expect(wrapper.vm.hasDelay).toBe(false);
  });
});
