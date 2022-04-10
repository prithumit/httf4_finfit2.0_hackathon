/* eslint-disable import/named */
import Vuetify from 'vuetify';
import { shallowMount, createLocalVue, mount } from '@vue/test-utils';

import Modal from '@/components/DCO-Modal/Modal.vue';

describe('Modal component', () => {
  const localVue = createLocalVue();
  const vuetify = new Vuetify();

  localVue.use(Vuetify);

  const propsData = {
    enabled: true,
    close: true,
    name: 'Clicks',
    title: 'Sample Modal',
    values: ['Sample', 'text'],
    cancelButton: 'Cancel',
    saveButton: 'Save',
    saveCallback: 'Save',
    cancelCallback: 'Cancel',
  };
  it('is mounted', () => {
    const wrapper = shallowMount(Modal, {
      localVue,
      propsData: {
        config: { name: '', title: '', values: [] },
      },
    });
    expect(wrapper.is(Modal)).toBe(true);
  });

  it('renders data from props', () => {
    const wrapper = mount(Modal, {
      localVue,
      vuetify,
      propsData: {
        config: propsData,
      },
    });

    expect(wrapper.find('.v-dialog__container').exists()).toBe(true);
  });

  it('emits save when save button is clicked', () => {
    const wrapper = mount(Modal, {
      localVue,
      vuetify,
      propsData: {
        config: propsData,
      },
    });

    wrapper.find('.save-btn').trigger('click');
    expect(wrapper.emitted('save')).toHaveLength(1);
  });

  it('emits cancel when cancel button is clicked', () => {
    const wrapper = mount(Modal, {
      localVue,
      vuetify,
      propsData: {
        config: propsData,
      },
    });

    wrapper.find('.cancel-btn').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });

  it('emits close when close button is clicked', () => {
    const wrapper = mount(Modal, {
      localVue,
      vuetify,
      propsData: {
        config: propsData,
      },
    });

    wrapper.find('.close-btn').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });

  it('emits close when close button is clicked and callback is false', () => {
    const propsDatas = {
      enabled: true,
      close: true,
      name: 'Clicks',
      title: 'Sample Modal',
      values: ['Sample', 'text'],
      cancelButton: 'Cancel',
      saveButton: 'Save',
      saveCallback: false,
      cancelCallback: false,
    };
    const wrapper = mount(Modal, {
      localVue,
      vuetify,
      propsData: {
        config: propsDatas,
      },
    });

    wrapper.find('.save-btn').trigger('click');
    expect(wrapper.emitted('save')).toHaveLength(1);

    wrapper.find('.cancel-btn').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
