<template>
  <div class="">
    <v-file-input
      v-model="files"
      @change="setData($event)"
      :label="label"
      accept=".pdf,.png,.jpg,.jpeg"
      :prepend-icon="iconObj[entityCode]"
      show-size
      :error="error"
    >
    </v-file-input>
    <div class="text-left">
      <v-layout row wrap>
        <v-flex xs8 sm12 md12 xl12 lg12>
          <v-icon :color="secondaryColor" medium class="pr-1"
            >mdi-information-outline</v-icon
          >
          <font class="caption font-weight-bold" :color="color">{{
            $t("form.fileUpload.info")
          }}</font>
        </v-flex>
        <v-flex>
          <div class="text-right">
            <v-btn
              :disabled="!files.type"
              :color="secondaryColor"
              @click="displayPdf"
              class="text-none mr-2"
              small
              outlined
              >Preview</v-btn
            >
            <v-btn
              :disabled="!files.type"
              :color="secondaryColor"
              @click="uploadPDF"
              class="text-none"
              small
              outlined
              >Upload</v-btn
            >
          </div>
        </v-flex>
      </v-layout>
    </div>
    <dco-modal
      :config="modalConfig"
      @cancel="modalConfig.enabled = false"
      v-if="modalConfig.enabled"
    >
      <div slot="modalContent" v-if="activeImage">
        <img :src="activeImage" style="max-width: 100%; width: auto" />
      </div>
      <div
        slot="modalContent"
        id="viewPdfFile"
        class="pdf-viewer"
        v-if="urlPdf"
      ></div>
    </dco-modal>
  </div>
</template>
<script>
import '@/_styles/components/fileUpload.scss';
import PDFObject from '@/_core/helpers/pdfViewer';
import store from '@/_core/store';
import CommonService from '@/_core/services/commonService';

export default {
  name: 'File-Upload',
  props: {
    enable: {
      type: Boolean,
      default: false,
    },
    persistData: {
      default: undefined,
    },
    label: {
      default: undefined,
    },
    inputData: {
      default: undefined,
    },
    entityCode: {
      default: undefined,
    },
    schema: {
      default: undefined,
    },
  },
  data: () => ({
    files: [],
    acceptedFileTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ],
    iconObj: {
      FECO_PROOF_CATEGORY_IDENTITY: 'mdi-account-card-details',
      FECO_PROOF_CATEGORY_ACCOUNT: 'mdi-file-document',
    },
    uploadIcon: 'mdi-information-outline',
    activeImage: undefined,
    urlPdf: undefined,
    enablePdfViewer: false,
    maxSize: undefined,
    error: false,
    color: undefined,
    fileTypeExists: false,
    modalConfig: {
      enabled: false,
      title: undefined,
      width: '1000px',
      persistent: true,
      cancelButton: 'Close',
    },
  }),
  created() {
    if (this.persistData) {
      this.handleDataUpdate(this.persistData.document);
    } else if (this.schema[this.inputData].id === 'required') {
        this.error = true;
      }

    this.color = this.errorColor;
    this.modalConfig.title = this.$t('form.fileUpload.message');
    this.maxSize = this.$appSettings.defaultConfigurations.maxUploadFileSize;
  },
  components: {
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  watch: {
    persistData(val) {
      if (val) {
        this.handleDataUpdate(val.document);
      }
    },
  },
  methods: {
    handleDataUpdate(file) {
      if (!file) {
        return;
      }
      if (file && this.acceptedFileTypes.includes(file.type)) {
        this.error = false;
        this.$emit('uploaded', {
          entityCode: this.entityCode,
          key: this.inputData,
        });

        if (file.type !== 'application/pdf') {
          const url = URL.createObjectURL(file);

          this.urlPdf = undefined;
          this.activeImage = url;
        } else {
          this.urlPdf = undefined;
          this.activeImage = undefined;
          this.files = file;
          this.enablePdfViewer = !!this.files;
          this.urlPdf = URL.createObjectURL(this.files);
        }
        this.files = file;
        this.color = undefined;
        this.enablePdfViewer = true;
      } else {
        this.invalidateInputField();
      }
    },
    base64ToArrayBuffer(data) {
      const binaryString = window.atob(data);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    },
    async uploadPDF() {
      const { file, entityId } = this.$store.getters['userData/userData'];
      let dataArr = await CommonService.getDropdownObj(
        `lookupValuesByEntityCode?entityCode=${this.entityCode}`,
      );
      const fileEntityId = this.$store.getters['userData/userData'][
        this.entityCode
      ]
        ? this.$store.getters['userData/userData'][this.entityCode].entityId
        : undefined;
      const fileVersion = this.$store.getters['userData/userData'][
        this.entityCode
      ]
        ? this.$store.getters['userData/userData'][this.entityCode].version
          ? this.$store.getters['userData/userData'][this.entityCode].version
          : 0
        : 0;

      if (dataArr.length === 1) {
        dataArr = dataArr[0];
      } else if (
          this.$store.getters['userData/userData']
          && this.$store.getters['userData/userData'].PersonalDetails
          && this.$store.getters['userData/userData'].PersonalDetails
            .nationalIdTypeCode
          && this.$store.getters['userData/userData'].PersonalDetails
            .nationalIdTypeCode !== ''
        ) {
          dataArr = dataArr.filter(
            entity => entity.entityName
              === this.$store.getters['userData/userData'].PersonalDetails
                .nationalIdTypeCode,
          )[0];
        } else {
          store.dispatch('appSettings/setAppConfig', {
            message: {
              content: this.$t('form.fileUpload.missingEntityCode'),
              type: 'error',
              component: 'dco-snackbar',
              timeOut: 2000,
            },
          });
          return;
        }

      const {
        entityId: documentSubCategoryId,
        parentEntityId: documentCategoryId,
      } = dataArr;
      const form = new FormData();

      if (fileEntityId) {
        form.append('entityId', fileEntityId);
      }
      form.append('document', file);
      form.append('documentCategoryId', documentCategoryId);
      form.append('applicationId', entityId);
      form.append('documentSubCategoryId', documentSubCategoryId);
      form.append('version', fileVersion);
      try {
        const response = await CommonService.documentUpload(form);
        const {
          documentType,
          documentData,
          documentName,
          entityId,
          documentStatus,
          version,
        } = response;

        if (documentStatus === 'SAVED') {
          if (documentData && documentData !== null) {
            this.$emit('uploaded', {
              entityCode: this.entityCode,
              key: this.inputData,
            });

            const document = new File(
              [this.base64ToArrayBuffer(documentData)],
              documentName,
              {
                type: documentType,
              },
            );

            this.$store.dispatch('userData/setUserData', {
              [this.entityCode]: {
                document,
                entityId,
                version,
              },
            });

            store.dispatch('appSettings/setAppConfig', {
              message: {
                content: this.$t('form.fileUpload.success'),
                type: 'success',
                component: 'dco-snackbar',
                timeOut: 2000,
              },
            });
          } else {
            store.dispatch('appSettings/setAppConfig', {
              message: {
                content: this.$t('form.fileUpload.processingErrorMessage'),
                type: 'error',
                component: 'dco-snackbar',
                timeOut: 2000,
              },
            });
          }

          this.$emit('uploaded', {
            entityCode: this.entityCode,
            key: this.inputData,
          });
        } else {
          this.error = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
    setData(file) {
      if (!file) {
        return;
      }
      this.color = undefined;
      if (file) {
        if (this.acceptedFileTypes.includes(file.type)) {
          if (Math.round(file.size / 1024) > this.maxSize) {
            this.files = [];
            this.$store.dispatch('appSettings/setAppConfig', {
              message: {
                content: this.$t('form.fileUpload.warning'),
                type: 'error',
                component: 'dco-snackbar',
                timeOut: 2000,
              },
            });
          } else if (file.type !== 'application/pdf') {
              const urlImage = URL.createObjectURL(file);

              this.enablePdfViewer = true;
              this.urlPdf = undefined;
              this.activeImage = urlImage;
              store.dispatch('userData/setUserData', {
                fileType: file.type,
                file,
              });
            } else {
              this.activeImage = undefined;
              this.urlPdf = undefined;
              this.enablePdfViewer = true;
              this.urlPdf = URL.createObjectURL(file);
              store.dispatch('userData/setUserData', {
                fileType: file.type,
                file,
              });
            }
        } else {
          this.invalidateInputField();
        }
      } else {
        this.invalidateInputField();
      }
      this.fileTypeExists = false;
    },
    displayPdf() {
      this.modalConfig.enabled = true;
      setTimeout(() => {
        PDFObject.embed(this.urlPdf, '#viewPdfFile', { forcePDFJS: true });
      }, 10);
    },
    invalidateInputField() {
      store.dispatch('appSettings/setAppConfig', {
        message: {
          content: this.$t('form.fileUpload.error'),
          type: 'error',
          component: 'dco-snackbar',
          timeOut: 2000,
        },
      });
      this.files = null;
      this.error = true;
      this.color = this.errorColor;
      this.fileTypeExists = false;
      store.dispatch('userData/setUserData', {
        fileType: undefined,
        file: undefined,
      });
    },
  },
};
</script>
