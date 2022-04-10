<template>
  <div class="mt-0">
    <v-container class="review-container">
      <v-card>
        <v-toolbar
          v-if="config.componentConfig.model"
          color="rgb(230, 230, 248)"
          class="white--text subtitle-1 font-weight-bold toolbar-header"
          style="height: 40px"
        >
          <font :color="primaryColor" class="pb-5">{{
            $t("reviewAndConsent.onboard_title")
          }}</font>
        </v-toolbar>
        <div class="pl-4 pb-4 pa-4">
          <template v-if="config.componentConfig.model">
            <div class="pb-1">
              <div>
                <v-row justify="space-between">
                  <font
                    :color="primaryColor"
                    class="subtitle-1 font-weight-regular ml-5"
                    >Contact Details</font
                  >
                  <v-icon
                    @click="editInline"
                    :color="primaryColor"
                    class="mr-5"
                    >{{
                      isEditEnabled ? "mdi-content-save" : "mdi-pencil"
                    }}</v-icon
                  >
                </v-row>
                <v-layout class="pl-2" wrap>
                  <template>
                    <v-flex
                      xs12
                      sm6
                      md4
                      lg4
                      xl3
                      class="subtitle-2 font-weight-regular"
                    >
                      <span class="subtitle-2 font-weight-bold"
                        >{{ $t("reviewAndConsent.email_label") }} :
                      </span>
                      <span data-qa="emailAddress" v-if="!isEditEnabled">{{
                        config.componentConfig.model.emailAddress
                      }}</span>
                      <v-text-field
                        v-model="editable.emailAddress"
                        maxlength="150"
                        :rules="[validation.emailAddress]"
                        @keyup.enter="
                          processInputData(
                            'emailAddress',
                            config.componentConfig.model.emailAddress
                          )
                        "
                        v-else
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      v-if="config.componentConfig.model.phoneNumber"
                      xs12
                      sm6
                      md4
                      lg4
                      xl3
                      class="subtitle-2 font-weight-regular"
                    >
                      <span class="subtitle-2 font-weight-bold"
                        >{{ $t("reviewAndConsent.mobile_label") }} :
                      </span>
                      <span data-qa="phoneNumber"
                        >{{config.componentConfig.model.phoneCountryCode}} {{
                          `${config.componentConfig.model.phoneNumber}`
                        }}</span
                      >
                    </v-flex>
                  </template>
                </v-layout>
                <v-divider class="pa-1" />
              </div>
            </div>
            <div
              v-for="(steps, stepIndex) in config.componentConfig.model
                .componentSchema.steps"
              :key="stepIndex"
            >
              <div
                v-for="(component, componentIndex) in steps.component"
                :key="componentIndex"
                v-if="component.enabled && component.preview"
              >
                <v-row justify="space-between">
                  <font
                    :color="primaryColor"
                    class="subtitle-1 font-weight-regular ml-5"
                    >{{ component.preview.label }}</font
                  >
                  <v-icon
                    @click="navigate(stepIndex)"
                    :color="primaryColor"
                    class="mr-5"
                    >mdi-pencil</v-icon
                  >
                </v-row>
                <v-layout class="pl-2" wrap>
                  <template
                    v-if="
                      config.componentConfig.model.display[component.label] &&
                      config.componentConfig.model.display[component.label]
                        .schema
                    "
                  >
                    <template
                      v-for="(index, item) in config.componentConfig.model
                        .display[component.label].schema"
                    >
                      <template
                        v-if="
                          config.componentConfig.model[item] &&
                          config.componentConfig.model.display[component.label]
                            .schema[item].preview
                        "
                      >
                        <template
                          v-if="
                            isVisible(
                              config.componentConfig.model.display[
                                component.label
                              ].schema[item]
                            ) &&
                            config.componentConfig.model.display[
                              component.label
                            ].schema[item].preview
                          "
                        >
                          <v-flex
                            :key="item"
                            :class="[
                              'subtitle-2 font-weight-regular',
                              getClass(
                                config.componentConfig.model.display[
                                  component.label
                                ].schema
                              ),
                            ]"
                          >
                            <span
                              class="subtitle-2 font-weight-bold"
                              v-if="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview &&
                                !config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.purge &&
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.label
                              "
                              :data-qa="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item]['data-qa']
                              "
                              >{{
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.label
                              }}
                              :
                            </span>
                            <span
                              class="subtitle-2 font-weight-bold"
                              v-if="
                                !config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview
                              "
                              :data-qa="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item]['data-qa']
                              "
                              >{{
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].label
                              }}
                              :
                            </span>
                            <v-icon
                              v-if="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview &&
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.format &&
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.format.icon
                              "
                              :color="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.format.color
                              "
                              class="pl-2"
                              >{{
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.format.icon
                              }}</v-icon
                            >
                            <span
                              :data-qa="item"
                              v-else-if="
                                !config.componentConfig.model.display[
                                  component.label
                                ].schema[item].items
                              "
                              >{{
                                formatData(
                                  config.componentConfig.model[item],
                                  config.componentConfig.model.display[
                                    component.label
                                  ].schema[item]["data-format"]
                                )
                              }}</span
                            >
                            <span :data-qa="item" v-else>{{
                              formatData(
                                findItemValue(
                                  config.componentConfig.model.display[
                                    component.label
                                  ].schema[item].items,
                                  config.componentConfig.model[item]
                                ),
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item]["data-format"]
                              )
                            }}</span>
                            <template
                              v-if="
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview &&
                                config.componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.purgeNext
                              "
                            >
                              <span
                                v-for="(subItem, index) in config
                                  .componentConfig.model.display[
                                  component.label
                                ].schema[item].preview.purgeNext"
                                v-if="config.componentConfig.model[subItem]"
                                :key="index"
                                :data-qa="subItem"
                                >{{
                                  config.componentConfig.model.display[
                                    component.label
                                  ].schema[item].preview.purgeSeperator
                                }}{{
                                  formatData(
                                    config.componentConfig.model[subItem],
                                    config.componentConfig.model.display[
                                      component.label
                                    ].schema[subItem]["data-format"]
                                  )
                                }}</span
                              >
                            </template>
                          </v-flex>
                        </template>
                      </template>
                    </template>
                  </template>

                  <template
                    v-else-if="isSchemaActive(component)"
                    class="pl-2"
                    wrap
                  >
                    <template v-if="failedStepObj && failedStepObj.schema">
                      <template v-for="(index, item) in failedStepObj.schema">
                        <template
                          v-if="
                            config.componentConfig.model[item] &&
                            !failedStepObj.schema[item].preview
                          "
                        >
                          <template
                            v-if="isVisible(failedStepObj.schema[item])"
                          >
                            <v-flex
                              :key="item"
                              :class="[
                                'subtitle-2 font-weight-regular',
                                getClass(failedStepObj.schema),
                              ]"
                            >
                              <span
                                class="subtitle-2 font-weight-bold"
                                v-if="
                                  failedStepObj.schema[item].preview &&
                                  !failedStepObj.schema[item].preview.purge &&
                                  failedStepObj.schema[item].preview.label
                                "
                                :data-qa="failedStepObj.schema[item]['data-qa']"
                                >{{ failedStepObj.schema[item].preview.label }}
                                :
                              </span>
                              <span
                                class="subtitle-2 font-weight-bold"
                                v-if="!failedStepObj.schema[item].preview"
                                :data-qa="failedStepObj.schema[item]['data-qa']"
                                >{{ failedStepObj.schema[item].label }} :
                              </span>
                              <v-icon
                                v-if="
                                  failedStepObj.schema[item].preview &&
                                  failedStepObj.schema[item].preview.format &&
                                  failedStepObj.schema[item].preview.format.icon
                                "
                                :color="
                                  failedStepObj.schema[item].preview.format
                                    .color
                                "
                                class="pl-2"
                                >{{
                                  failedStepObj.schema[item].preview.format.icon
                                }}</v-icon
                              >
                              <span
                                :data-qa="item"
                                v-else-if="!failedStepObj.schema[item].items"
                                >{{
                                  formatData(
                                    config.componentConfig.model[item],
                                    failedStepObj.schema[item]["data-format"]
                                  )
                                }}</span
                              >
                              <span :data-qa="item" v-else>{{
                                formatData(
                                  findItemValue(
                                    failedStepObj.schema[item].items,
                                    config.componentConfig.model[item]
                                  ),
                                  failedStepObj.schema[item]["data-format"]
                                )
                              }}</span>
                              <template
                                v-if="
                                  failedStepObj.schema[item].preview &&
                                  failedStepObj.schema[item].preview.purgeNext
                                "
                              >
                                <span
                                  v-for="(subItem, index) in failedStepObj
                                    .schema[item].preview.purgeNext"
                                  v-if="config.componentConfig.model[subItem]"
                                  :key="index"
                                  :data-qa="subItem"
                                  >{{
                                    failedStepObj.schema[item].preview
                                      .purgeSeperator
                                  }}{{
                                    formatData(
                                      config.componentConfig.model[subItem],
                                      failedStepObj.schema[subItem][
                                        "data-format"
                                      ]
                                    )
                                  }}</span
                                >
                              </template>
                            </v-flex>
                          </template>
                        </template>
                      </template>
                    </template>
                  </template>
                </v-layout>
                <v-divider class="pa-1" />
              </div>
            </div>
          </template>
          <div v-if="productDetails">
            <!-- <v-divider class="pa-1" /> -->
            <font :color="primaryColor" class="subtitle-1 pl-2">{{
              $t("reviewAndConsent.selectedProduct_label")
            }}</font>
            <v-flex
              xs12
              xl12
              lg12
              sm12
              md12
              class="subtitle-1 font-weight-regular pl-2 pb-0"
            >
              <span data-qa="ProductType">Savings Account</span>
            </v-flex>
            <v-layout class="pl-2" row wrap>
              <v-flex
                class="subtitle-2 font-weight-regular"
                xs12
                xl8
                lg9
                sm9
                md9
              >
                <span data-qa="Description"><b>Regular Savings Gold Account (Flexi)</b></span>
              </v-flex>
              <!--<v-flex
                v-if="config.componentConfig.store"
                class="subtitle-2 font-weight-regular"
                xs12
                xl3
                lg4
                sm3
                md4
              >
                <span class="subtitle-2 font-weight-bold"
                  >{{ $t("reviewAndConsent.termLength_label") }} :
                </span>
                <span data-qa="Tenure">{{ productDetails.Tenure }} </span>
                <span data-qa="termUnit">{{
                  $t(
                    `reviewAndConsent.termUnit.${config.componentConfig.store.termUnit}`
                  )
                }}</span>
              </v-flex>-->
              <v-flex
                class="subtitle-2 font-weight-regular"
                xs12
                xl8
                lg9
                sm9
                md9
              >
                <span class="subtitle-2 font-weight-bold"
                  >{{ $t("reviewAndConsent.rdi_label") }} :
                </span>
                <span data-qa="Description"
                  >3.65 %</span
                >
              </v-flex>
              <v-flex
                v-if="productDetails && productDetails.minimumBalance"
                class="subtitle-2 font-weight-regular"
                xs12
                xl8
                lg9
                sm9
                md9
              >
                <span class="subtitle-2 font-weight-bold"
                  >{{ $t("reviewAndConsent.minmax_label") }} :
                </span>
                <span data-qa="Description"
                  >{{ productDetails.minimumBalance.value }}-{{
                    productDetails.maximumBalance.value
                  }}{{ productDetails.maximumBalance.currency }}</span
                >
              </v-flex>
              <v-layout v-if="enableFSCSDeclaration" row wrap>
                <v-flex xs3 sm2 md2 lg1 xl1>
                  <img
                    alt="FSCS-logo"
                    height="60px"
                    width="100px"
                    src="@/assets/fscs_logo.png"
                  />
                </v-flex>
                <v-flex
                  xs9
                  sm10
                  md10
                  lg11
                  xl11
                  class="review-container__fscs-text"
                >
                  <div class="pt-2 pl-5 body-2 font-weight-regular">
                    {{ $t("reviewAndConsent.financial_services") }}
                  </div>
                </v-flex>
              </v-layout>
            </v-layout>
          </div>
        </div>
      </v-card>
      <br />
      <div v-for="(item, key, index) in declarationAndConsent" :key="index">
        <v-expansion-panels :value="0" class="pa-0">
          <v-expansion-panel class="elevation-2">
            <v-card>
              <v-expansion-panel-header color="rgb(230, 230, 248)" class="pa-0">
                <v-toolbar
                  color="rgb(230, 230, 248)"
                  class="white--text subtitle-1 font-weight-bold toolbar-header"
                >
                  <font :color="primaryColor" class="pb-5">
                    <span data-qa="declarationAndConsentKey">{{
                      $t("reviewAndConsent." + key)
                    }}</span>
                  </font>
                </v-toolbar>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pt-4 pl-0">
                <v-layout
                  class="review-container__customer-confirmation"
                  row
                  wrap
                >
                  <v-checkbox
                    v-model="item.isChecked"
                    v-if="config.componentConfig.model"
                    @change="handleConsent({ key, index }, $event)"
                    :disabled="
                      config.componentConfig.model &&
                      config.componentConfig.model.failedCustomer &&
                      config.componentConfig.model.applicationStatus ===
                        'SIGNOFF'
                    "
                    :color="secondaryColor"
                    :data-qa="`checkbox-parent-${index}`"
                    class="pa-0 review-container__consent-check review-container__customer-confirmation"
                  ></v-checkbox>

                  <v-flex xs10 sm10 md11 lg11 xl11>
                    <span
                      data-qa="declarationAndConsentText"
                      slot="label"
                      class="pt-0 body-2 font-weight-regular"
                    >
                      <span v-if="index !== 0">
                        <font class="pt-0 body-2 font-weight-regular"
                          >{{ $t("reviewAndConsent.bankTermsConsent") }}
                        </font>
                        <a
                          @click="openTermsAndCondition"
                          class="home__underlined-cursor-pointer"
                        >
                          <font class="pt-0 body-2 font-weight-regular">{{
                            $t("home.tos")
                          }}</font>
                        </a>
                      </span>
                      {{ item.text }}
                    </span>
                    <v-flex v-if="item.options && item.isChecked">
                      <v-layout row wrap class="pt-4">
                        <v-flex
                          v-for="(option, index) in item.options"
                          :key="index"
                          class="review-container__marketing-options"
                          xs6
                          sm3
                          md2
                          lg2
                          xl1
                        >
                          <v-tooltip :disabled="checkSelectedOption" top>
                            <template v-slot:activator="{ on }">
                              <div v-on="on">
                                <v-checkbox
                                  v-model="option.isChecked"
                                  @change.capture="
                                    handleConsent(
                                      {
                                        key,
                                        selectedOption: option.value,
                                        index,
                                        digitalChannel: true,
                                      },
                                      $event
                                    )
                                  "
                                  :disabled="
                                    config.componentConfig.model &&
                                    config.componentConfig.model
                                      .failedCustomer &&
                                    config.componentConfig.model
                                      .applicationStatus === 'SIGNOFF'
                                  "
                                  :label="option.value"
                                  :color="secondaryColor"
                                  :data-qa="`checkbox-child-${index}`"
                                  class="pa-0"
                                ></v-checkbox>
                              </div>
                            </template>
                            <span data-qa="declarationAndConsentToolTip">{{
                              item.toolTip
                            }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-card>
          </v-expansion-panel>
        </v-expansion-panels>
        <br />
      </div>
    </v-container>
    <dco-modal
      v-if="termsAndConditionsModel.enabled"
      :config="termsAndConditionsModel"
    >
      <ul
        v-for="(terms, index) in termsAndConditions.terms"
        :key="index"
        slot="modalContent"
      >
        <li>{{ terms }}</li>
      </ul>
    </dco-modal>
  </div>
</template>

<script>
import CommonService from "@/_core/services/commonService";
import handleError from "@/_core/helpers/errorHandler";
import "@/_styles/pages/reviewAndConsent.scss";
import events from "@/_core/helpers/event";
import store from "@/_core/store";
import {
  emailAddress,
  phoneNumber,
  phoneNumberMaxLen,
  emailRequired,
} from "@/_core/helpers/validationRules";

export default {
  name: "Onboard",
  data() {
    return {
      termsAndConditions: this.$appSettings.termsAndConditionContents,
      termsAndConditionsModel: {
        enabled: false,
        name: "DCO",
        saveButton: "OK, GOT IT",
        title: "Terms and Conditions",
        "max-height": "50px",
        width: "500px",
        close: true,
      },
      declarationPanel: [],
      declarationAndConsent: this.$appSettings.consentDeclarationContents,
      enableFSCSDeclaration: this.$appSettings.defaultConfigurations
        .enableFSCSDeclaration,
      enableAccountVerification: this.$appSettings.defaultConfigurations
        .enableAccountVerification,
      productDetails: {},
      appConsent: {},
      valid: false,
      marketingChannels: {},
      checkSelectedOption: false,
      failedStepObj: undefined,
      isEditEnabled: false,
      editable: {
        emailAddress: "",
        phoneNumber: "",
      },
      validation: {
        emailAddress,
        phoneNumber,
        phoneNumberMaxLen,
        emailRequired,
      },
    };
  },
  // updated() {
  //   events.$emit("userInput", {
  //     consent: this.appConsent,
  //   });
  // },
  components: {
    "dco-modal": () => import("@/components/DCO-Modal/Modal.vue"),
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  created() {
    this.getproductDetails();
  },
  methods: {
    openTermsAndCondition(event = true) {
      this.termsAndConditionsModel.enabled = event;
    },
    async processInputData(type, data) {
      this.isEditEnabled = false;
      this.config.componentConfig.model.emailAddress = this.editable.emailAddress;
      this.config.componentConfig.model.phoneNumber = this.editable.phoneNumber;

      const { available } = await CommonService.verifyEmail(
        this.editable.emailAddress
      );

      if (available) {
        const { status } = await CommonService.sendVerificationEmail(
          this.editable.emailAddress
        );

        if (status) {
          store.dispatch("appSettings/setAppConfig", {
            message: {
              content: this.$t("home.email_verification.content"),
              type: "success",
              component: "dco-snackbar",
            },
          });
        }
      }

      store.dispatch("userData/setUserData", {
        emailUpdateOnReview: true,
        emailAddress: this.editable.emailAddress,
        phoneNumber: this.editable.phoneNumber,
      });
    },
    editInline() {
      if (this.isEditEnabled) {
        this.processInputData(
          "emailAddress",
          this.config.componentConfig.model.emailAddress
        );
        this.isEditEnabled = false;
      } else {
        this.isEditEnabled = true;
        this.editable = {
          emailAddress: this.config.componentConfig.model.emailAddress,
          phoneNumber: this.config.componentConfig.model.phoneNumber,
        };
      }
    },
    addFormat(dataString) {
      return dataString ? `${dataString}, ` : "";
    },
    async getproductDetails() {
      try {
        this.productDetails = await CommonService.getProductDetails();
        const data = {
          productDetails: this.productDetails,
        };
        setTimeout(() => this.$emit("update", { data }));
      } catch (e) {
        handleError(e);
      }
    },
    handleConsent({ key, selectedOption, index, digitalChannel = false }, e) {
      let valid = false;
      const digitalChannelObj = (channelName) => ({
        channelName,
        channelDescription: channelName,
      });
      const filterTOS = (filterValue) =>
        Object.keys(this.declarationAndConsent).filter(
          (statement) => this.declarationAndConsent[statement][filterValue]
        );

      if (digitalChannel && e) {
        this.marketingChannels = Object.assign(this.marketingChannels, {
          [selectedOption]: digitalChannelObj(selectedOption),
        });
      } else if (digitalChannel && !e) {
        delete this.marketingChannels[selectedOption];
      } else {
        this.declarationAndConsent[key].isChecked = e;
      }
      const marketingChannels = Object.values(this.marketingChannels);
      const acceptedTOS = Object.keys(this.declarationAndConsent).filter(
        (statement) =>
          this.declarationAndConsent[statement].isChecked &&
          this.declarationAndConsent[statement].mandatory
      );

      this.appConsent = Object.assign(this.appConsent, { [key]: e });
      if (acceptedTOS.length === filterTOS("mandatory").length) {
        this.appConsent = Object.assign(this.appConsent, { [key]: e });
        if (
          (this.declarationAndConsent[filterTOS("options").toString()]
            .isChecked &&
            Boolean(marketingChannels.length)) ||
          !this.declarationAndConsent[filterTOS("options").toString()].isChecked
        ) {
          valid = true;
        }

        const data = {
          applicationStatus: "SIGNOFF",
          appConsent: this.appConsent,
          marketingChannels,
        };

        this.$emit("update", { data });
        events.$emit("userInput", {
          consent: this.appConsent,
        });
      } else {
        const data = {
          applicationStatus: "DRAFT",
          appConsent: "",
          marketingChannels,
        };

        events.$emit("userInput", {
          consent: false,
        });

        this.$emit("update", { data });
      }
      this.checkSelectedOption =
        (this.declarationAndConsent[filterTOS("options").toString()]
          .isChecked &&
          Boolean(marketingChannels.length)) ||
        !this.declarationAndConsent[filterTOS("options").toString()].isChecked;
      events.$emit("validForm", valid);
    },
    formatPhoneNumber(phoneNumber) {
      return `${phoneNumber.substring(2, 4)} ${phoneNumber
        .substring(5, phoneNumber.length)
        .replace(" ", "")}`;
    },
    formatData(data, type) {
      switch (type) {
        case "date":
          return data ? `${data.replace(/-/g, " - ")}` : "";
        default:
          return data;
      }
    },
    getClass(schema) {
      const gridSize =
        12 / Object.keys(schema).length < 5
          ? 4
          : 12 / Object.keys(schema).length;

      return ` col-xs-12 col-md-${gridSize} col-sm-${gridSize}`;
    },
    findItemValue(items, name) {
      if (items) {
        let filterVal = items.filter((item) => item.value === name)[0];
        filterVal = filterVal ? filterVal.text : name;

        return filterVal;
      }
    },
    isVisible(schema) {
      let flag = true;

      if (schema.preview) {
        flag = !schema.preview.purge;
      }
      return flag;
    },
    async isSchemaActive({ name, schemaName, validation }) {
      if (!this.failedStepObj) {
        this.failedStepObj = await CommonService.getComponentSchema(
          name,
          schemaName,
          validation
        );
      }

      return false;
    },
    navigate(stepIndex) {
      this.$emit("navigate", stepIndex + 1);
    },
  },
};
</script>
