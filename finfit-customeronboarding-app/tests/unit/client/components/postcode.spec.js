import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, mount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import { i18n } from '@/plugins/vueI18n';
import appSettings from '@/plugins/appSettings';
import PostcodeLookup from '@/components/DCO-Form/PostcodeLookup.vue';
import store from '@/_core/store';
import CommonService from '@/_core/services/commonService';

Vue.prototype.$appSettings = appSettings;

const sampleAddress = {
  addressId: '',
  addressType: 'BUSINESS',
  country: 'UK',
  townOrCity: 'Birmingham',
  line1: '',
  line2: 'First main Street',
  line3: 'Edinburgh',
  line4: 'LiverPool Street',
  line5: 'Buckinghamshire',
  postalCode: 'CB62AG',
  buildingNumber: '234',
};

describe('PostcodeLookup component', () => {
  let wrapper;
  let vuetify;
  const localVue = createLocalVue();

  localVue.use(Vuetify);
  localVue.use(VueI18n);

  beforeEach(() => {
    CommonService.getAddress = jest.fn().mockReturnValue(Promise.resolve({ items: sampleAddress }));
    vuetify = new Vuetify();
    wrapper = mount(PostcodeLookup, {
      store,
      localVue,
      vuetify,
      i18n,
      appSettings,
      propsData: {
        enable: true,
        inputData: 'CB62AG',
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(PostcodeLookup)).toBe(true);
  });

  it('trigger save event', () => {
    wrapper.find('.postcode-lookup--list-value').trigger('click');
    expect(wrapper.emitted('value')).toHaveLength(1);
  });

  it('trigger onClose method', () => {
    wrapper.vm.onClose();
    expect(wrapper.emitted('value')).toHaveLength(1);
  });

  it('trigger enableManualAddress method', () => {
    wrapper.vm.enableManualAddress(true);
    expect(wrapper.vm.manualAddress).toBe(true);
  });

  it('trigger getAddress method', () => {
    wrapper.vm.inputData = '62AG01';
    CommonService.getAddress = jest.fn().mockReturnValue(Promise.resolve([
      {
        name: 'test'
      }
    ]));
    wrapper.vm.getAddress();
    expect(JSON.stringify(wrapper.vm.addressList)).toBe("{\"items\":{\"addressId\":\"\",\"addressType\":\"BUSINESS\",\"country\":\"UK\",\"townOrCity\":\"Birmingham\",\"line1\":\"\",\"line2\":\"First main Street\",\"line3\":\"Edinburgh\",\"line4\":\"LiverPool Street\",\"line5\":\"Buckinghamshire\",\"postalCode\":\"CB62AG\",\"buildingNumber\":\"234\"}}");
  });
});
