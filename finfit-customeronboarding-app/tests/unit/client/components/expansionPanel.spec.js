/* eslint-disable import/named */
import Vuetify from 'vuetify';
import { mount, createLocalVue } from '@vue/test-utils';
import ExpansionPanel from '@/components/DCO-ExpansionPanel/ExpansionPanel.vue';

describe('ExpansionPanel component', () => {
  let wrapper;
  let vuetify;
  const localVue = createLocalVue();
  localVue.use(Vuetify);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExpansionPanel, {
      localVue,
      vuetify,
      propsData: {
        config: {
          label: 'Personal Details',
          isEnabled: true,
        },
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(ExpansionPanel)).toBe(true);
  });
});
