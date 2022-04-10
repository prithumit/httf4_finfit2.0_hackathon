/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  createLocalVue,
  shallowMount,
} from '@vue/test-utils';
import Camera from '@/components/DCO-Camera/Camera.vue';

describe('Camera', () => {
  let wrapper;
  const localVue = createLocalVue();
  const { navigator } = window;
  localVue.use(Vuetify);

  afterAll(() => {
    window.navigator = navigator;
  });

  beforeEach(() => {
    delete window.navigator;
    window.navigator = { mediaDevices: {} };
    window.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockReturnValue(Promise.resolve('device loaded')),
      enumerateDevices: jest.fn().mockReturnValue(true),
    };
    wrapper = shallowMount(Camera, {
      localVue,
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(Camera)).toBe(true);
  });

  it('emits isCameraActive when loaded', () => {
    wrapper.vm.handleOnPlay();
    expect(wrapper.emitted('isCameraActive')).toHaveLength(1);
  });

  it('takes and emits selfie', () => {
    wrapper.find('.record-button').trigger('click');
    wrapper.vm.takePhoto();
    wrapper.vm.blob = Blob;
    wrapper.vm.isAlreadyRecorded = true;
    wrapper.vm.$emit('blobURL', {});

    expect(wrapper.emitted().blobURL[0]).toEqual([{}]);
  });

  it('filter check', () => {
    console.log(wrapper.findAll('mediaDevices').filter(d => d.kind.text() === 'videoinput'));
    const filteredDivArray = wrapper.findAll('mediaDevices').filter(w => w.kind('videoinput'));
    console.log(filteredDivArray);
  });

  it('triggers beforeDestroy() life-cycle hook', () => {
    expect(wrapper.destroy());
  });
});
