/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  mount,
  createLocalVue,
} from '@vue/test-utils';

import Stepper from '@/components/DCO-Stepper/Stepper.vue';

describe('Stepper', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(Vuetify);

  beforeEach(() => {
    wrapper = mount(Stepper, {
      localVue,
      propsData: {
        config: {
          index: 0,
          settings: { isMobileDevice: false },
        },
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(Stepper)).toBe(true);
  });

  it('is valid', () => {
    wrapper.setProps({
      config: {
        index: 0,
        settings: { isMobileDevice: true },
      },
    });
    expect(wrapper.is(Stepper)).toBe(true);
  });
});
