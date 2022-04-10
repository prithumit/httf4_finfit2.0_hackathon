<template v-slot:activator="{ on }">
  <v-container class="form-container">
    <component :is="wrapper">
      <v-toolbar
        v-if="!config.isEnabled"
        color="rgb(230, 230, 248)"
        class="white--text subtitle-1 toolbar-header"
      >
        <v-icon :color="primaryColor" medium class="pb-5 pr-3">{{
          config.icon
        }}</v-icon>
        <font :color="primaryColor" class="pb-5 font-weight-bold">{{
          config.label
        }}</font>
        <v-spacer />
        <!-- <v-icon
          :color="primaryColor"
          medium
          class="pb-5"
        >{{ config.icon }}</v-icon> -->
      </v-toolbar>
      <v-card-text>
        <v-form
          v-if="
            arg && arg.config[config.name] && arg.config[config.name].schema
          "
          ref="form"
          v-model="valid"
          :lazy-validation="false"
        >
          <v-form-base
            :value="arg.config[config.name].model"
            :schema="arg.config[config.name].schema"
            :formCheck="
              checkFormSanity(
                arg.config[config.name].schema,
                arg.config[config.name].model
              )
            "
            @blur="onBlur($event)"
            @input="
              isFormValid($event);
              toggleDisable(arg.config[config.name].model, $event);
              validateRegEx($event);
              onFieldChange($event);
            "
            @update="onFieldChange"
            @focus="getType($event)"
            @click="onFieldClick($event)"
            @change="toggleRegex($event)"
            class="pt-2"
            :key="componentKey"
          >
            <component
              v-if="enableComponent"
              :is="component"
              :slot="getSlotName()"
              @value="handleInput($event)"
              @uploaded="manageFileUpload"
              :schema="arg.config[config.name].schema"
              :label="label"
              :entityCode="entityCode"
              :enable="enableComponent"
              :persistData="persistData"
              :inputData="componentInput"
            ></component>
          </v-form-base>
        </v-form>
      </v-card-text>
    </component>
  </v-container>
</template>

<script>
/* eslint-disable no-param-reassign */
import "@/_styles/components/form.scss";
import VFormBase from "dco-vuetify-form";
import { VCard, VContent } from "vuetify/lib";
import events from "@/_core/helpers/event";
import formFieldsMixin from "@/_core/mixins/formFieldsMixin";
import routeMixin from "@/_core/mixins/routeMixin";
import CommonService from "@/_core/services/commonService";

export default {
  mixins: [formFieldsMixin, routeMixin],
  name: "Form",
  components: {
    VFormBase,
    VCard,
    VContent,
    "file-upload": () => import("@/components/DCO-Form/FileUpload.vue"),
    "postcode-lookup": () => import("@/components/DCO-Form/PostcodeLookup.vue"),
  },
  props: {
    config: {
      type: Object,
      default: undefined,
    },
    wrapper: {
      type: String,
      default() {
        return this.config.isEnabled ? "VContent" : "VCard";
      },
    },
  },
  data() {
    return {
      entityCode: "",
      componentKey: 0,
      uploadKey: 0,
      enableFileComponent: false,
      valid: true,
      component: undefined,
      key: undefined,
      orientation: "bottom",
      enableComponent: false,
      componentInput: undefined,
      arg: undefined,
      isFileValid: true,
      persistData: undefined,
      label: undefined,
      isDataPreloaded: false,
      docChecks: [],
    };
  },
  created() {
    // events.$emit("formValidity", this.valid);
    this.$emit("getConfig", true);
  },
  updated() {
    events.$on("loadForm", (arg) => {
      this.arg = arg;
      this.isFileGot = false;
    });
    events.$on("response", (arg) => {
      this.invalidAccount(arg);
    });
  },
  methods: {
    manageFileUpload(event) {
      this.getDocument(event.entityCode, this.arg.config.store.entityId);

      Object.assign(this.arg.config[this.config.name].model, {
        [event.key]: "uploaded",
      });

      if (event && event.key) {
        this.emitUpdated(this.arg.config[this.config.name].model);
      }
    },
    dropdown({ data, obj }) {
      if (obj) {
        const { key, schema, value } = obj;

        if (
          this.arg.config[this.config.name].schema &&
          this.arg.config[this.config.name].model
        ) {
          this.loadDropDownForm(key);
        }
      }
    },
    async loadDropDownForm(key, force = false) {
      const { "data-api-key": dataApi, dynamic, triggered } = this.arg.config[
        this.config.name
      ].schema[key];

      if (dataApi && !triggered) {
        let ddItems;
        setTimeout(() => {
          if (
            dynamic &&
            this.arg.config[this.config.name].schema[key].dynamic.key &&
            this.arg.config[this.config.name].model[
              this.arg.config[this.config.name].schema[key].dynamic.key
            ] &&
            !force
          ) {
            this.loadDropDownForm(key, true);
          }
        }, 1000);
        if (!dynamic) {
          ddItems = await CommonService.getDropdownObj(
            this.arg.config[this.config.name].schema[key]["data-api-key"]
          );
        } else if (
          (dynamic || force) &&
          this.arg.config[this.config.name].schema[key].dynamic.key
        ) {
          if (
            !Array.isArray(
              this.arg.config[this.config.name].schema[key].dynamic.key
            ) &&
            this.arg.config[this.config.name].model[
              this.arg.config[this.config.name].schema[key].dynamic.key
            ]
          ) {
            ddItems = await CommonService.getDropdownObj(
              `${
                this.arg.config[this.config.name].schema[key]["data-api-key"]
              }/${
                this.arg.config[this.config.name].model[
                  this.arg.config[this.config.name].schema[key].dynamic.key
                ]
              }`
            );
          } else {
            if (
              this.arg.config[this.config.name].schema[key].dynamic.key &&
              Array.isArray(
                this.arg.config[this.config.name].schema[key].dynamic.key
              )
            ) {
              setTimeout(async () => {
                let quitFlag = false;

                const routePathVariable = this.arg.config[
                  this.config.name
                ].schema[key].dynamic.key
                  .map((key) => {
                    if (this.arg.config[this.config.name].model[key]) {
                      return this.arg.config[this.config.name].model[key];
                    } else {
                      quitFlag = true;
                    }
                  })
                  .join("/");
                if (!quitFlag) {
                  ddItems = await CommonService.getDropdownObj(
                    `${
                      this.arg.config[this.config.name].schema[key][
                        "data-api-key"
                      ]
                    }/${routePathVariable}`
                  );
                }
              }, 500);
            }
          }

          if (ddItems) {
            const modelObj = {
              key,
              obj: { schema: this.arg.config[this.config.name].schema[key] },
            };

            this.loadModelOnSelect(modelObj);
          }
        }
        if (this.arg.config[this.config.name].schema[key] && ddItems) {
          Object.assign(this.arg.config[this.config.name].schema[key], {
            triggered: true,
          });
          this.arg.config[this.config.name].schema[key].items = ddItems;
        }
        this.componentKey = this.componentKey + 1;
      }
    },
    onBlur(event) {
      const { isMobile } = this.config.componentConfig.store;
      if (!isMobile) {
        this.isFormValid(event);
      }
      this.verifyAccountNumber(event);
    },
    getConfig(state) {
      this.$emit("getConfig", state);
    },
    isFormValid() {
      events.$emit("formValidity", this.valid);
    },
    getType({ obj }) {
      const { componentKeyEnable } = obj.schema;

      if (componentKeyEnable) {
        this.key = componentKeyEnable;
      }
    },
    getSlotName() {
      return `slot-${this.orientation}-key-${this.key}`;
    },
    getEnabledKey(schema, searchKey) {
      return Object.keys(schema)
        .filter((key) => schema[key][searchKey])
        .toString();
    },
    handleInput(e) {
      Object.assign(this.arg.config[this.config.name].model, e[0]);
      if (e[0]) {
        const excludeFields = Object.keys(
          this.arg.config[this.config.name].schema
        ).filter((key) => !e[0][key]);
        this.$store.dispatch("appSettings/setAppConfig", {
          excludeFields,
        });
        this.toggleManual(excludeFields, false);
        this.emitUpdated(this.arg.config[this.config.name].model);
      }

      this.enableComponent = e.enabled;
      this.clearInputFields(e);
    },
    onFieldChange({ data, obj }) {
      if (obj) {
        const { key, schema, value } = obj;
        const inputValue = data[key];
        const { componentKeyEnable } = schema;

        if (componentKeyEnable) {
          this.key = componentKeyEnable;
        }
        if (schema["data-type"]) {
          this.component = schema["data-type"];
        }
        if (this.component && inputValue) {
          if (
            schema["trigger-length"] === 0 ||
            inputValue.length >= schema["trigger-length"]
          ) {
            this.enableComponent = true;
          }
        }
        if (schema.type === "calendar") {
          this.formatDate(value, key);
        }
        if (schema.type === "file" && value) {
          this.uploadDocument(value, key, data, schema);
        }
        this.componentInput = data[schema["data-relation"]];
        data.applicationStatus = this.config.signedOffStatus
          ? "SIGNOFF"
          : "DRAFT";
        this.emitUpdated(data);
      }
    },
    async getDocument(documentCode, entityId) {
      if (documentCode) {
        if (!this.$store.getters["userData/userData"][documentCode]) {
          this.$store.dispatch("userData/setUserData", {
            [documentCode]: {},
          });

          try {
            if (entityId) {
              this.$store.dispatch("appSettings/setAppConfig", {
                message: {
                  content: this.$t("home.file_fetch"),
                  type: "success",
                  component: "dco-snackbar",
                },
              });
              const retrieveFile = await CommonService.getFile(
                entityId,
                documentCode
              );

              if (retrieveFile) {
                const {
                  documentType,
                  documentData,
                  documentName,
                  entityId,
                  version,
                } = retrieveFile;

                if (documentData) {
                  const document = new File(
                    [this.base64ToArrayBuffer(documentData)],
                    documentName,
                    {
                      type: documentType,
                    }
                  );
                  this.$store.dispatch("userData/setUserData", {
                    [documentCode]: {
                      document,
                      entityId,
                      version,
                    },
                  });
                  this.persistData = {
                    document,
                    entityId,
                    version,
                  };
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          this.persistData = this.$store.getters["userData/userData"][
            documentCode
          ];
        }
      }
    },
    onFieldClick({ data, obj }) {
      if (obj) {
        const { schema, key } = obj;
        let value = "";
        const validateField = obj.schema["data-relation"];

        if (!this.arg.config[this.config.name].model[validateField]) {
          this.arg.config[this.config.name].model[validateField] = undefined;
        }
        if (schema["data-type"]) {
          this.component = schema["data-type"];
        }
        if (schema["data-relation"]) {
          value = this.arg.config[this.config.name].model[
            schema["data-relation"]
          ];
        }
        if (this.component && value) {
          if (
            schema["trigger-info"] === 0 ||
            value.length >= schema["trigger-info"]
          ) {
            this.enableComponent = true;
          }
        }
        this.componentInput = data[schema["data-relation"]];
        data.applicationStatus = this.config.signedOffStatus
          ? "SIGNOFF"
          : "DRAFT";
        this.emitUpdated(data);
      }
    },
    emitUpdated(data) {
      const { label, state, schemaName } = this.config;

      this.$emit("update", {
        data,
        schema: this.arg.config[this.config.name].schema,
        label,
        state,
        schemaName,
      });
    },
    create_blob(file, callback) {
      var reader = new FileReader();
      reader.onload = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    },
  },
  watch: {
    valid() {
      events.$emit("formValidity", this.valid);
    },
    isFileValid() {
      this.$emit("isValid", this.isFileValid);
    },
    config() {
      this.componentKey = this.componentKey + 1;
      this.enableComponent = false;
    },
  },
};
</script>
