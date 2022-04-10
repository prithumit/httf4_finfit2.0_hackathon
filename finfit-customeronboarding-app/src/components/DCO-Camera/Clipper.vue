<template>
  <div>
    <clipper-basic
      v-if="config.image"
      :border="3"
      :initWidth="90"
      :initHeight="90"
      ref="clipper"
      :wrapRatio="1 / 1"
      :grid="false"
      :src="config.image"
      :clipImage="getClippedImage()"
    ></clipper-basic>
  </div>
</template>

<script>
import Vue from "vue";
import VueRx from "vue-rx";
import { clipperBasic } from "vuejs-clipper";
import CommonService from "@/_core/services/commonService";

Vue.use(VueRx);
export default {
  name: "dco-clipper",
  components: {
    clipperBasic,
  },
  props: {
    config: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      clippedImage: undefined,
    };
  },
  methods: {
    async uploadImage(imageFile) {
      const { entityId } = this.$store.getters["userData/userData"];
      const [dataArr] = await CommonService.getDropdownObj(
        "lookupValuesByEntityCode?entityCode=FECO_PROOF_CATEGORY_PHOTO"
      );
      const {
        entityId: documentSubCategoryId,
        parentEntityId: documentCategoryId,
      } = dataArr;
      let imageEntityId = undefined;
      let version = undefined;

      if (
        this.$store.getters["userData/userData"]["FECO_PROOF_CATEGORY_PHOTO"]
      ) {
        imageEntityId =
          this.$store.getters["userData/userData"]["FECO_PROOF_CATEGORY_PHOTO"]
            .entityId;
        version =
          this.$store.getters["userData/userData"]["FECO_PROOF_CATEGORY_PHOTO"]
            .version;
      }

      const form = new FormData();

      if (entityId) {
        if (imageEntityId) {
          form.append("entityId", imageEntityId);
        }
        form.append("document", imageFile);
        form.append("documentCategoryId", documentCategoryId);
        form.append("applicationId", entityId);
        form.append("documentSubCategoryId", documentSubCategoryId);
        form.append("version", version ? version : 0);
        try {
          const response = await CommonService.documentUpload(form);
          if (response.documentStatus === "SAVED") {
            this.$store.dispatch("userData/setUserData", {
              FECO_PROOF_CATEGORY_PHOTO: response,
            });
            this.$store.dispatch("appSettings/setAppConfig", {
              message: {
                content: this.$t("form.fileUpload.success"),
                type: "success",
                component: "dco-snackbar",
                timeOut: 2000,
              },
            });
          } else {
            this.error = true;
          }
        } catch (e) {
          console.log(e);
          // this.error = true;
        }
      }
    },
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },
    getClippedImage() {
      let img;
      if (this.config.isActive) {
        const canvas = this.$refs.clipper.clip();
        canvas.toBlob((blob) => {
          img = document.createElement("img");
          img.src = window.URL.createObjectURL(blob);

          this.clippedImage = canvas.toDataURL("image/jpg", 1);
          this.$emit("clippedImage", {
            image: this.clippedImage,
            blobUrl: img.src,
          });
          const personalImage = new File([blob], "personal_image.jpg");

          this.uploadImage(personalImage);
        });
      }
    },
  },
};
</script>
