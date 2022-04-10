/* eslint-disable import/named */
import Vuetify from 'vuetify';
import { createLocalVue, mount } from '@vue/test-utils';
import FileUpload from '@/components/DCO-Form/FileUpload.vue';
import { i18n } from '@/plugins/vueI18n';
import appSettings from '@/plugins/appSettings';
import CommonService from '@/_core/services/commonService';
import store from '@/_core/store';

describe('FileUpload component', () => {
  const file = {
    name: 'sample.pdf',
    size: 1024,
    type: 'application/pdf',
  };

  let wrapper;
  let vuetify;
  const localVue = createLocalVue();
  localVue.use(Vuetify);
  localVue.use(appSettings);

  beforeEach(() => {
    vuetify = new Vuetify();
    store.dispatch('userStore/setUserData', { file, entityId: '123456789' })
    URL.createObjectURL = jest.fn();
    wrapper = mount(FileUpload, {
      localVue,
      vuetify,
      i18n,
      store,
      mocks: {
        $appSettings: appSettings,
        navigator: {
          mimeTypes: true,
        },
      },
      propsData: {
        persistData: file,
      },
    });
  });

  it('is mounted', () => {
    // expect(wrapper.is(FileUpload)).toBe(true);
  });

  it('calls setData on uploading the file', () => {
    expect(wrapper.vm.enablePdfViewer).toBe(false);
    wrapper.vm.setData(file);
  });

  it('calls displayPdf on click of file preview', () => {
    wrapper.vm.displayPdf();
    expect(wrapper.vm.modalConfig.enabled).toBe(true);
  });

  it('calls documentUpload service on click of file upload', () => {
    CommonService.getDropdownObj = jest.fn().mockReturnValue(Promise.resolve([{ entityId: '123456789', parentEntityId: '123456789' }]));
    CommonService.documentUpload = jest.fn().mockReturnValue(Promise.resolve({ documentStatus: 'SAVED' }));
    wrapper.vm.uploadPDF();
    expect(wrapper.vm.error).toBe(false);
  });

  it('calls displayPdf on click of file preview', () => {
    wrapper.vm.setData(file);
    // expect(wrapper.vm.files).toEqual({"name": "sample.pdf", "size": 1024, "type": "jpg"});
    expect(wrapper.vm.files).toEqual([]);
  });
});
