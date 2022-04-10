/* eslint-disable import/named */
import Vuetify from 'vuetify';
import {
  mount,
  createLocalVue,
} from '@vue/test-utils';
import VueRx from 'vue-rx';
import { clipperBasic } from 'vuejs-clipper';
import Clipper from '@/components/DCO-Camera/Clipper.vue';

describe('Clipper', () => {
  const localVue = createLocalVue();
  let wrapper;

  localVue.use(Vuetify);
  localVue.use(VueRx);

  beforeEach(() => {
    wrapper = mount(Clipper, {
      localVue,
      propsData: {
        config: {
          image: 'image/jpg',
        },
      },
      components: {
        clipperBasic,
      },
    });
  });

  it('is mounted', () => {
    expect(wrapper.is(Clipper)).toBe(true);
  });

  it('renders when props is valid', () => {
    wrapper.setProps({
      config: {
        image: 'image/jpg',
        isActive: true,
      },
    });
    expect(wrapper.find('.clipper-basic').exists()).toBe(true);
  });

  it('renders when props is valid', () => {
    wrapper.setProps({
      config: {
        image: 'image/jpg',
        isActive: true,
      },
    });
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);

    //wrapper.vm.getClippedImage();
    // wrapper.vm.$on('clippedImage', wrapper.vm.clippedImage);
    // expect(wrapper.vm.clippedImage).toHaveBeenCalledTimes(1);
    // expect(wrapper.emitted('clippedImage', wrapper.vm.clippedImage)).toHaveBeenCalledTimes(1);
  });

  it('converts the image to blob for upload', () => {
    const canvas = document.createElement("CANVAS")

    wrapper.vm.$refs.clipper = {
      clip: () => {
        return canvas
      }
    };

    wrapper.setProps({
      config: {
        image: 'image/jpg',
        isActive: true,
      },
    });

    wrapper.vm.getClippedImage();
    // wrapper.vm.$on('clippedImage', wrapper.vm.clippedImage);
    // expect(wrapper.vm.clippedImage).toHaveBeenCalledTimes(1);
    // expect(wrapper.emitted('clippedImage', wrapper.vm.clippedImage)).toHaveBeenCalledTimes(1);
  });

});
