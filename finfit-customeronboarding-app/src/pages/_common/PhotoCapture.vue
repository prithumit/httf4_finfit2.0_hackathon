<template>
  <div class="photo-capture">
    <v-container class="text-center">
      <v-row>
        <v-col lg="12">
          <v-avatar
            v-if="!image.clippedImage"
            :height="image.height"
            :width="image.width"
            tile
            class="photo-capture--border"
          >
            <v-col cols="12">
              <v-icon
                :size="image.height - (1 / 6) * image.height"
                color="#F8BBD0"
                >mdi-account</v-icon
              >
            </v-col>
          </v-avatar>
          <v-avatar
            v-if="image.clippedImage"
            :height="image.height"
            :width="image.width"
            tile
            class="photo-capture--border"
          >
            <v-img
              v-if="image.clippedImage"
              :src="image.clippedImage"
              :alt="image.clippedImage"
            >
              <div class="text-right">
                <v-icon
                  @click="deleteClippedImage()"
                  :color="secondaryColor"
                  medium
                  class="photo-capture--icon-align"
                  name="closeIcon"
                  >mdi-close-circle</v-icon
                >
              </div>
            </v-img>
          </v-avatar>
        </v-col>

        <v-col lg="12" class="pt-0">
          <span>
            <v-icon :color="secondaryColor" medium class="pr-1"
              >mdi-information-outline</v-icon
            >
            <font class="caption font-weight-light pt-2"
              >{{ $t("photoCapture.upload_info") }}
              {{ image.maxSize / 1024 }}MB</font
            >
          </span>
          <v-card-actions>
            <v-row justify="center">
              <div class="pr-1">
                <v-btn
                  @click="isCamera()"
                  :color="secondaryColor"
                  small
                  class="camera white--text text-none"
                >
                  {{ $t("photoCapture.camera_button") }}
                  <v-icon small right dark>mdi-camera</v-icon>
                </v-btn>
              </div>
              <div class="pl-1">
                <clipper-upload
                  v-model="image.browsedImage"
                  @input="isBrowse($event)"
                  accept="image/gif, image/jpeg, image/png"
                >
                  <v-btn
                    :color="secondaryColor"
                    small
                    class="browse white--text text-none"
                  >
                    {{ $t("photoCapture.browse_button") }}
                    <v-icon small right dark>mdi-upload</v-icon>
                  </v-btn>
                </clipper-upload>
              </div>
            </v-row>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>

    <dco-modal @save="onSave()" @cancel="onClose()" :config="modal">
      <v-progress-linear
        :active="!image.isCameraReady && !isDcoClipper()"
        :color="secondaryColor"
        indeterminate
        height="10"
        slot="modalContent"
      ></v-progress-linear>

      <dco-camera
        v-if="isDcoCamera()"
        @blobURL="recievedImage($event)"
        @isCameraActive="isCameraActive($event)"
        :isCameraStopped="cameraState"
        slot="modalContent"
      ></dco-camera>

      <dco-clipper
        v-if="isDcoClipper() && image.isAcceptable"
        @clippedImage="recievedClippedImage($event)"
        :config="{
          image: this.image.uploadedImage
            ? this.image.uploadedImage
            : this.image.browsedImage,
          isActive: image.isClipped,
        }"
        :title="changeModalTitle()"
        slot="modalContent"
      ></dco-clipper>
    </dco-modal>
  </div>
</template>

<script>
import "@/_styles/pages/photoCapture.scss";
import { clipperUpload } from "vuejs-clipper";
import modal from "@/components/DCO-Modal/Modal.vue";

export default {
  name: "dco-photoCapture",
  components: {
    clipperUpload,
    "dco-modal": modal,
    "dco-camera": () => import("@/components/DCO-Camera/Camera.vue"),
    "dco-clipper": () => import("@/components/DCO-Camera/Clipper.vue"),
  },
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      imageSizeInfo: false,
      cameraState: undefined,
      image: {
        maxSize: this.$appSettings.defaultConfigurations.maxUploadFileSize,
        height: this.$appSettings.defaultConfigurations
          .uploadCustomerPhotoHeight,
        width: this.$appSettings.defaultConfigurations.uploadCustomerPhotoWidth,
        isAcceptable: true,
        browsedImage: undefined,
        clippedImage: undefined,
        uploadedImage: Blob,
        isCameraReady: false,
        isClipped: false,
      },
      modal: {
        enabled: false,
        name: "DCO",
        title: this.$t("photoCapture.face_the_camera"),
        "max-height": "300px",
        width: "450",
        close: true,
      },
    };
  },
  methods: {
    isDcoClipper() {
      return this.image.uploadedImage
        ? this.image.uploadedImage
        : this.image.browsedImage;
    },
    isDcoCamera() {
      return !this.image.uploadedImage && !this.image.browsedImage;
    },
    recievedImage({ image, stream }) {
      this.image.uploadedImage = image;
      this.image.isAcceptable = true;

      stream.getTracks().forEach((track) => {
        track.stop();
      });
    },
    recievedClippedImage(clippedImage) {
      this.image.clippedImage = clippedImage.image;
      this.$store.dispatch("userData/setUserData", {
        profilePhoto: clippedImage.blobUrl,
      });
      this.modal.enabled = false;
      this.image.isClipped = false;
      this.$emit("isValid", true);
    },
    deleteClippedImage() {
      this.image.clippedImage = false;
    },
    onSave() {
      this.image.isClipped = !this.image.isClipped;
    },
    onClose() {
      this.cameraState = true;
    },
    changeModalTitle() {
      this.modal.title = this.$t("photoCapture.crop_image");
      this.modal.saveButton = this.$t("common.saveButton_text");
    },
    isBrowse(e) {
      this.validateFileSize(e);
      this.image.uploadedImage = undefined;
    },
    validateFileSize(imageFile) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", imageFile, true);
      xhr.responseType = "blob";

      xhr.onload = ({ target }) => {
        const { response, status } = target;
        const { size } = response;

        if (status === 200) {
          if (Math.round(size / 1024) > this.image.maxSize) {
            this.$store.dispatch("appSettings/setAppConfig", {
              message: {
                content: this.$t("photoCapture.image_size_exceeded"),
                type: "error",
                component: "dco-snackbar",
              },
            });
            this.image.isAcceptable = false;
          } else {
            this.image.isAcceptable = true;
            this.modal.enabled = true;
          }
        }
      };
      xhr.send();
    },
    isCamera() {
      this.cameraState = false;
      this.modal.enabled = !this.modal.enabled;
      this.image.isClipped = false;
      this.image.uploadedImage = undefined;
      this.image.browsedImage = undefined;
      this.image.isCameraReady = false;
      this.modal.saveButton = "";
      this.modal.title = this.$t("photoCapture.face_the_camera");
    },
    isCameraActive(state) {
      this.image.isCameraReady = state;
    },
  },
  created() {
    const img = this.$store.getters["userData/userData"][
      "FECO_PROOF_CATEGORY_PHOTO"
    ];

    if (img) {
      this.image.clippedImage = `data:image/png;base64,${img.documentData}`;
      this.$store.dispatch("userData/setUserData", {
        profilePhoto: img.document,
      });
      this.$emit("isValid", !this.config.validation);
    }
  },
};
</script>
