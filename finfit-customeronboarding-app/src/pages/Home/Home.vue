/* eslint-disable no-restricted-globals */
<template>
  <v-app class="home">
    <v-row>
      <v-col cols="6" class="order-md-2 order-lg-2 pa-0 hidden-xs-only">
        <v-container fill-height fluid class="pa-0 ma-0">
          <v-img height="100%" src="@/assets/login.jpg"></v-img>
        </v-container>
      </v-col>
      <v-col
        md12
        sm12
        class="order-md-1 order-lg-1"
        :style="{ background: gradients }"
      >
        <v-row class="">
          <img
            alt="logo"
            height="auto"
            width="200px"
            src="@/assets/fin_logo.png"
            id="images"
            class="loginTitle pa-5"
          />
        </v-row>
        <v-row>
          <v-container fluid class="px-0 mx-md-3">
            <v-flex class="pt-lg-12 pa-8" xs12 sm12 md12 lg12 xl12>
              <v-flex class="text-center" xs12 sm11 md12 lg12 xl12>
                <font class="home__welcome-heading font-weight-medium"
                  >{{ $t("home.welcome") }}
                  <b class="font-weight-bold">{{
                    $appSettings.applicationSettings.bankName
                  }}</b
                  >&nbsp;{{ $t("home.bank") }}</font
                >
              </v-flex>
              <v-flex class="text-center" xs12 sm12 md12 lg12 xl12 pa-3>
                <font
                  :color="primaryColor"
                  class="title font-weight-regular"
                  v-if="getProductCode && getProductType"
                  >{{ $t("home.tagLine") }}</font
                >
                <font
                  :color="primaryColor"
                  class="title font-weight-regular"
                  v-else
                  >{{ $t("home.missingProduct") }}</font
                >
              </v-flex>
              <v-alert
                border="top"
                colored-border
                :color="primaryColor"
                elevation="2"
                class="mt-3"
                v-if="
                  enableResidentCheck &&
                  !home.setOTPSection &&
                  !home.isUkResident &&
                  !home.setUKResident &&
                  getProductCode &&
                  getProductType
                "
              >
                <v-layout
                  row
                  v-if="
                    !home.setOTPSection &&
                    !home.isUkResident &&
                    !home.setUKResident &&
                    getProductCode &&
                    getProductType
                  "
                  class="text-center"
                >
                  <v-flex xs12 sm11 md12 lg12 xl12 pa-3>
                    <font class="subtitle-2 font-weight-regular">{{
                      $t("home.intro." + getProductType)
                    }}</font>
                  </v-flex>
                </v-layout>
                <v-flex class="px-10">
                  <div
                    v-if="!home.isUkResident && !home.setUKResident"
                    class="mt-5"
                  >
                    <p
                      v-for="(term, index) in $appSettings
                        .termsAndConditionContents[getProductType]"
                      :key="index"
                    >
                      <span class="font-weight-bold black--text">{{
                        $t(`home.disclaimer.${getProductType}.${term}`)
                      }}</span>
                    </p>
                  </div>
                </v-flex>
              </v-alert>
              <div
                v-if="home.isUkResident && !home.setUKResident"
                class="text-xs-center"
              >
                <v-row class="justify-center">
                  <v-flex xs12 sm10 md12 lg12 xl7>
                    <div class="pt-5">
                      <v-alert
                        color="#FFA76D"
                        prominent="true"
                        elevation="4"
                        icon="mdi-alert-outline"
                        class="home--alert-padding pa-2"
                      >
                        <font class="body-1 font-weight-light black--text">{{
                          $t("home.notUKResidentDesc")
                        }}</font>
                      </v-alert>
                      <div class="pt-2 text-center">
                        <v-btn
                          @click="
                            home.isUkResident = false;
                            enableResidentCheck = true;
                          "
                          fab
                          medium
                          :color="primaryColor"
                          data-qa="home-uk-resident-no"
                          dark
                        >
                          <v-icon medium>mdi-arrow-left</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-flex>
                </v-row>
              </div>
              <div
                v-if="home.setUKResident && !home.setOTPSection"
                align-center
              >
                <v-flex v-if="disableLandingPageDialog ? false : true" pa-3>
                  <font class="title font-weight-bold black--text">{{
                    $t("home.resident")
                  }}</font>
                </v-flex>
                <v-form
                  ref="form"
                  v-model="home.valid"
                  :lazy-validation="false"
                >
                  <v-layout wrap justify-center>
                    <v-flex class="ml-2 mr-2" xs11 sm11 md12 lg10>
                      <v-row>
                        <v-select
                          v-model="selectedcountry"
                          :items="entries"
                          :loading="isLoading"
                          :search-input.sync="searchCountry"
                          :color="primaryColor"
                          hide-no-data
                          item-text="value"
                          item-value="key"
                          label="Country Code"
                          placeholder=""
                          prepend-icon=""
                          return-object
                          solo
                          class="col-md-4 mr-md-2"
                        ></v-select>
                        <v-text-field
                          data-qa="phone number"
                          v-model="home.phoneNumber"
                          :rules="[rules.required, rules.phone]"
                          label="Phone number"
                          maxlength="10"
                          @keyup.enter="home.valid ? getOTP() : false"
                          class="home--validation-error phone-number-input"
                          solo
                        >
                        </v-text-field>
                      </v-row>
                    </v-flex>
                    <v-flex class="ml-2 mr-2" xs11 sm11 md12 lg10>
                      <v-row>
                        <v-text-field
                          type="email"
                          data-qa="email"
                          autocomplete="off"
                          :rules="[rules.emailAddress]"
                          required="false"
                          v-model="home.emailAddress"
                          label="E-mail Address"
                          maxlength="120"
                          class="home--validation-error"
                          solo
                        ></v-text-field>
                      </v-row>
                    </v-flex>
                    <v-flex xs11 sm11 md5 lg10 class="text-right">
                      <v-btn
                        xs2
                        sm2
                        md2
                        lg2
                        fab
                        medium
                        @click="getOTP()"
                        :color="primaryColor"
                        :disabled="!home.valid"
                        class="home__fetch-OTP-arrow pa-4"
                        data-qa="home-next"
                      >
                        <v-icon color="white" medium>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </div>

              <v-row
                justify="center"
                v-if="
                  enableResidentCheck &&
                  !home.setOTPSection &&
                  !home.isUkResident &&
                  !home.setUKResident &&
                  getProductCode &&
                  getProductType
                "
              >
                <div class="text-xs-center pt-2">
                  <v-layout row justify-center>
                    <div class="pa-1">
                      <v-btn
                        @click="
                          home.setUKResident = true;
                          enableResidentCheck = false;
                        "
                        large
                        data-qa="home-yes"
                        class="font-weight-light"
                        :color="primaryColor"
                        dark
                      >
                        <font class="px-2 text-none">{{ $t("home.yes") }}</font>
                      </v-btn>
                    </div>
                    <div class="pa-1">
                      <v-btn
                        @click="
                          home.isUkResident = true;
                          enableResidentCheck = false;
                        "
                        large
                        data-qa="home-no"
                        class="font-weight-light"
                      >
                        <font :color="primaryColor" class="py-1 text-none">{{
                          $t("home.no")
                        }}</font>
                      </v-btn>
                    </div>
                  </v-layout>
                </div>
              </v-row>

              <v-flex v-if="home.setOTPSection" class="text-center">
                <div class="text-xs-center">
                  <v-alert
                    border="top"
                    colored-border
                    :color="primaryColor"
                    elevation="2"
                    class="mt-3 pa-4"
                  >
                    <p
                      class="font-weight-regular black--text text-xs-center py-3"
                    >
                      {{ $t("home.otp") }}
                      <font class="font-weight-bold subtitle-1"
                        >{{ home.phoneCountryCode }}
                        {{ home.phoneNumber }}</font
                      >
                      <span v-if="home.emailAddress">
                        {{ $t("common.and") }}
                      </span>
                      <font class="font-weight-bold subtitle-1">{{
                        home.emailAddress
                      }}</font>
                    </p>
                    <v-row no-gutters class="justify-center">
                      <v-flex
                        class="pt-0 home__email-btn hidden-sm-and-down"
                        lg3
                        sm2
                        md3
                      ></v-flex>
                      <v-flex lg4 sm8 md5>
                        <v-text-field
                          v-model="otp.hash"
                          @keyup="validateOTP"
                          @paste.prevent
                          :disabled="otp.isValid"
                          :maxlength="otp.maxLength"
                          :color="primaryColor"
                          autocomplete="false"
                          label="Enter One Time Pin"
                          class="home--resendOTP"
                          data-qa="otp"
                          solo
                          autofocus
                          prepend-inner-icon="mdi-clock-outline"
                        >
                          <template v-slot:append>
                            <v-progress-circular
                              indeterminate
                              :color="primaryColor"
                              v-if="otp.hash && !isValidLength()"
                            ></v-progress-circular>
                            <v-icon
                              v-if="otp.isValid && isValidLength()"
                              color="success"
                              data-qa="otp-success"
                              x-large
                              >mdi-check-circle</v-icon
                            >
                            <v-icon
                              v-if="!otp.isValid && isValidLength()"
                              color="error"
                              data-qa="otp-error"
                              x-large
                              >mdi-close-circle</v-icon
                            >
                          </template>
                        </v-text-field>
                      </v-flex>
                      <v-flex class="pt-3 home__email-btn" lg3 sm2 md3 xs12>
                        <v-btn-toggle :background-color="primaryColor" outlined>
                          <v-btn
                            color="white"
                            @click="fetchOTP('resend')"
                            :disabled="
                              isResendActive.mobile.timerActive ||
                              isResendActive.mobile.disabled
                            "
                            outlined
                            small
                            class="text-none"
                            data-qa="resend-otp"
                          >
                            {{
                              !isResendActive.mobile.timerActive
                                ? $t("home.resend")
                                : `Resend OTP in ${isResendActive.mobile.counter}`
                            }}
                          </v-btn>
                        </v-btn-toggle>
                      </v-flex>

                      <v-flex></v-flex>
                    </v-row>
                    <v-row justify="center" no-gutters>
                      <v-checkbox
                        v-model="home.agreeTermsFlag"
                        :disabled="!otp.isValid"
                        :color="primaryColor"
                        data-qa="home-tos"
                      >
                        <span slot="append">
                          <font class="body-1 black--text"
                            >{{ $t("home.agree") }}
                          </font>
                          <a
                            @click="openTermsAndCondition"
                            class="home__underlined-cursor-pointer"
                          >
                            <font color="#80D8FF">{{ $t("home.tos") }}</font>
                          </a>
                        </span>
                      </v-checkbox>
                    </v-row>
                    <v-row justify="center" no-gutters class="pt-4 pb-4">
                      <v-btn
                        @click="handleUser"
                        :disabled="!isTOSDisabled()"
                        x-large
                        :color="primaryColor"
                        dark
                        class="font-weight-normal agree-tos"
                        data-qa="tos-btn"
                      >
                        <font class="">{{ $t("home.getStarted") }}</font>
                      </v-btn>
                    </v-row>
                  </v-alert>
                </div>
              </v-flex>
            </v-flex>
          </v-container>
        </v-row>
      </v-col>
    </v-row>
    <cookie-law
      theme="blood-orange"
      class="pt-1 pb-1"
      :buttonText="$t('common.okay')"
    >
      <div slot="message">
        {{ $appSettings.applicationSettings.bankName }}
        {{ $t("home.cookiePolicy") }}
        <span class="home__underlined-cursor-pointer">
          <router-link to="legal-notes">{{
            $t("home.privacyPolicy")
          }}</router-link>
        </span>
      </div>
    </cookie-law>

    <dco-modal
      v-if="termsAndConditionsModel.enabled"
      @save="agreeToTermsAndCondition"
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
  </v-app>
</template>

<script>
import '@/_styles/pages/home.scss';
import CookieLaw from 'vue-cookie-law';
import CommonService from '@/_core/services/commonService';
import handleError from '@/_core/helpers/errorHandler';
import routeMixin from '@/_core/mixins/routeMixin';
import {
  emailAddress,
  phoneNumber,
  phoneNumberMaxLen,
  emailRequired,
} from '@/_core/helpers/validationRules';
import store from '@/_core/store';

export default {
  name: 'Home',
  components: {
    CookieLaw,
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  mixins: [routeMixin],
  data() {
    return {
      rules: {
        emailAddress: (value) => {
          if (value) {
 return (
              new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(
                value,
              ) || 'Enter a valid email address'
            );
}
          return true;
        },
        required: value => !!value || 'Phone number is required',
        counter: value => value.length <= 20 || 'Max 20 characters',
        phone: (value) => {
          const pattern = /^[0-9]{10}$/;
          return pattern.test(value) || 'Invalid phone number';
        },
      },
      downloadDCViaIosURL: this.$appSettings.applicationSettings
        .digitalChannelsIOSURL,
      downloadDCViaAndroidURL: this.$appSettings.applicationSettings
        .digitalChannelsAndriodURL,
      termsAndConditions: this.$appSettings.termsAndConditionContents,
      countryISDCode: this.$appSettings.defaultConfigurations.countryISDCode,
      otpTimeInterval: this.$appSettings.defaultConfigurations
        .otpResendTimeInterval,
      emailTimeInterval: this.$appSettings.defaultConfigurations
        .emailResendTimeInterval,
      isTOSMandatory: this.$appSettings.defaultConfigurations.isTOSMandatory,
      enableTargetCountryAlert: this.$appSettings.defaultConfigurations
        .enableTargetCountryAlert,
      bankUrl: this.$appSettings.applicationSettings.digitalChannelsWebURL,
      disableLandingPageDialog: this.$appSettings.defaultConfigurations
        .disableLandingPageDialog,
      isResendActive: {
        mobile: {
          timerActive: false,
          disabled: false,
          counter: 0,
        },
        email: {
          timerActive: false,
          disabled: true,
          counter: 0,
        },
      },
      otp: {
        isValid: false,
        hash: '',
        maxLength: 6,
      },
      home: {
        phoneCountryCode: null,
        agreeTermsFlag: false,
        emailAddress: null,
        invalidIcon: true,
        isUkResident: false,
        seeMore: false,
        setUKResident: false,
        setOTPSection: false,
        phoneNumber: null,
        valid: true,
        validIcon: true,
        internationalPhoneNumber: null,
        isValidated: false,
      },
      validation: {
        emailAddress,
        phoneNumber,
        phoneNumberMaxLen,
        emailRequired,
      },
      termsAndConditionsModel: {
        enabled: false,
        name: 'DCO',
        saveButton: 'OK, GOT IT',
        title: 'Terms and Conditions',
        'max-height': '50px',
        width: '500px',
        close: true,
      },
      userObj: undefined,
      enableResidentCheck: true,
      entries: [],
      isLoading: false,
      selectedcountry: null,
      searchCountry: null,
      isValidateTriggered: false,
    };
  },
  computed: {
    getProductType() {
      return this.$route.params.productType || '';
    },
    getProductCode() {
      return this.$route.params.productCode || '';
    },
    /* for country codes */
    countryCodes() {
      return this.entries.map((entry) => {
        const Description = entry.value.length > 5
            ? `${entry.value.slice(0, 5)}...`
            : entry.value;

        return Object.assign({}, entry, { Description });
      });
    },
  },
  created() {
    this.getCountryCodes();

    setTimeout(() => {
      this.getProductInformation();
      if (this.entries.length) {
        this.entries.filter(
          entry => entry.value
            === this.$appSettings.defaultConfigurations.countryISDCode,
        );
        this.selectedcountry = this.entries[0];
      }
    }, 1000);

    this.getUserCountry();
    if (this.disableLandingPageDialog) {
      this.isUkResident = true;
      this.setUKResident = true;
      this.home.setUKResident = true;
      this.home.setOTPSection = false;
    }
  },
  methods: {
    async handleUser() {
      let isAllowed = false;
      let verificationEmailStatus;
      const invalidEmailStates = ['PENDING', 'No entry found'];

      if (!this.isValidated) {
        this.isValidated = true;
        const prospectPayload = {
          number: this.home.phoneNumber,
          email: this.home.emailAddress,
          isAuthorized: true,
        };

        try {
          if (this.home.emailAddress && this.home.emailAddress !== null) {
            verificationEmailStatus = await CommonService.verifyEmailStatus(
              this.home.emailAddress,
            );
          }

          const { userStatus, entityId } = await CommonService.verifyUserStatus(
            {
              mobilePhoneNumber: this.home.phoneNumber,
              mobileCountryCode: this.countryISDCode,
            },
          );

          this.userObj = { userStatus };
          if (userStatus === null) {
            if (
              (this.home.emailAddress !== null
                && verificationEmailStatus
                && !invalidEmailStates.includes(verificationEmailStatus.status))
              || !this.home.emailAddress
              || this.home.emailAddress === null
              || this.home.emailAddress.length < 1
            ) {
              isAllowed = Boolean(userStatus === null);

              this.dispatchToStore('userData/setUserData', ...prospectPayload);
            } else {
              this.isValidated = false;
              this.dispatchSnackBar(
                this.$t(`home.email_verify.${verificationEmailStatus.status}`),
              );
              return;
            }
          } else if (userStatus === 'Customer') {
            this.dispatchModal(
              `${this.$t('home.customer.content')}<ul style="margin: 0;
                    list-style: none;
                    display: inline-flex;
                    padding: 0;
                    width: 100%;
                    justify-content: center;
                "><li><span style="background: #000;
                display: block;
                width: 135px;
                padding: 5px;
                border-radius: 4px;
                color: #fff;
                margin: 0px;
                display: inline-block;
                text-align: center;">
                <i class="mdi mdi-android theme--dark" style="font-size: 19px;"></i>
                <a style="color: #fff; text-decoration: none;" href="">${this.$t(
                  'onboard_confirmation.download_app_via.andriod',
                )}</a></span></li>
                <li style="margin-left: 10px;"><span style="background: #000;
                display: block;
                width: 135px;
                padding: 5px;
                border-radius: 4px;
                color: #fff;
                margin: 0px;
                display: inline-block;
                text-align: center;">
                <i class="mdi mdi-apple theme--dark" style="font-size: 19px;"></i>
                <a style="color: #fff; text-decoration: none;" href="">${this.$t(
                  'onboard_confirmation.download_app_via.ios',
                )}</a></span></li></ul>`,
              this.$t('home.customer.title'),
              this.$t('common.okay'),
            );
            this.resetHome();
            this.enableResidentCheck = true;
          } else if (userStatus === 'Prospect') {
            await this.getProspectApplication(entityId);
          } else {
            this.resetHome();
          }
        } catch (e) {
          this.resetHome(isAllowed);
          handleError(e);
        }
      }

      if (isAllowed) {
        this.redirectToWizard();
      }
    },
    async proceedToNext() {
      const { userStatus } = this.userObj;

      if (userStatus !== 'Customer') {
        const status = !!store.getters['userData/userData'].applicationStatus;
        this.redirectToWizard(status);
      } else {
        this.resetHome();
        window.open(this.bankUrl, '_blank');
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
    async abortApplication() {
      const status = await CommonService.abortApplication(this.userObj);

      this.redirectToWizard(
        !(status === ''),
        'Your Application data has been deleted successfully!',
      );
      store.dispatch('userData/removeUserData');
      this.enableResidentCheck = true;
      this.home.isUkResident = false;
      this.home.setUKResident = false;
      this.otp.isValid = false;
      this.resetHome();
    },
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    async getProspectApplication(entityId) {
      this.dispatchToStore('userData/setUserData', { entityId });
      const retrieveFile = await CommonService.getFile(
        entityId,
        'FECO_PROOF_CATEGORY_PHOTO',
      );
      const {
        documentType,
        documentData,
        documentName,
        version,
      } = retrieveFile;

      if (documentData) {
        // const document = new File(
        //   [this.base64ToArrayBuffer(documentData)],
        //   documentName,
        //   {
        //     type: documentType,
        //   }
        // );

        const blob = this.b64toBlob(documentData, 'image/jpg');
        const blobUrl = URL.createObjectURL(blob);

        this.$store.dispatch('userData/setUserData', {
          FECO_PROOF_CATEGORY_PHOTO: {
            documentData,
            document: blobUrl,
            entityId: retrieveFile.entityId,
            version,
          },
        });
      }
      try {
        const acceptedKeyArr = [
          'personalInformation',
          'productInformation',
          'contactInformation',
          'taxInformation',
          'accountInformation',
        ];
        const prospectAppData = await CommonService.getProspectApp(entityId);

        this.dispatchToStore('userData/setUserData', {
          emailAddress: prospectAppData.emailId,
        });
        Object.assign(this.userObj, prospectAppData);
        Object.assign(this.userObj, { returnCustomer: true });
        Object.keys(prospectAppData).map((key) => {
          if (acceptedKeyArr.includes(key)) {
            Object.assign(this.userObj, JSON.parse(prospectAppData[key]));
          }
        });

        this.dispatchToStore('userData/setUserData', {
          ...this.userObj,
        });

        this.dispatchToStore('userData/setUserData', {
          ...prospectAppData,
        });

        this.dispatchModal(
          this.$t('home.prospect.content'),
          this.$t('home.prospect.title'),
          this.$t('common.yes'),
          this.$t('common.start_fresh'),
        );
      } catch (e) {
        handleError(e);
      }
      return false;
    },
    resetHome(reset = true) {
      if (reset) {
        Object.assign(this.home, {
          enableResidentCheck: true,
          setOTPSection: false,
          isUkResident: false,
          setUKResident: false,
          phoneNumber: null,
          emailAddress: null,
          agreeTermsFlag: false,
        });
        this.isValidateTriggered = false;
        this.otp.isValid = false;
      }
      this.isValidated = false;
    },
    async verifyAndCreateCustomer(type, prospectData) {
      try {
        const status = await CommonService.verifyAndCreateCustomer(
          type,
          prospectData,
        );
      } catch (e) {
        handleError(e);
      }
    },
    async getProductInformation() {
      const productInfo = await CommonService.getProductDetails();

      this.dispatchToStore('userData/setUserData', {
        productInformation: productInfo,
      });
    },
    async getUserCountry() {
      const { coords } = store.getters['appSettings/config'];

      if (this.enableTargetCountryAlert) {
        try {
          const countryCode = await CommonService.getCountryFromLatLong(coords);

          if (countryCode && countryCode !== 'UK') {
            this.dispatchSnackBar(this.$t('home.notin_uk'));
          }
        } catch (e) {
          handleError(e);
        }
      }
    },
    async getUserCountry() {
      const { coords } = store.getters['appSettings/config'];

      if (this.enableTargetCountryAlert) {
        try {
          const countryCode = await CommonService.getCountryFromLatLong(coords);

          if (countryCode && countryCode !== 'UK') {
            this.dispatchSnackBar(this.$t('home.notin_uk'));
          }
        } catch (e) {
          handleError(e);
        }
      }
    },
    dispatchSnackBar(content, type = 'error') {
      store.dispatch('appSettings/setAppConfig', {
        message: {
          content,
          type,
          component: 'dco-snackbar',
        },
      });
    },
    dispatchModal(
      content,
      title,
      saveButton = undefined,
      cancelButton = undefined,
      displayActionButtons = true,
      close = false,
    ) {
      const message = {
        content,
        type: 'success',
        component: 'dco-modal',
        title,
      };
      const actionBtn = {
        cancelButton,
        saveCallback: this.proceedToNext,
        cancelCallback: this.abortApplication,
        persistent: true,
      };
      const closeBtn = { close };
      const saveBtn = { saveButton };

      if (displayActionButtons) {
        Object.assign(message, actionBtn, saveBtn);
      }

      Object.assign(message, closeBtn, saveBtn);
      store.dispatch('appSettings/setAppConfig', {
        message,
      });
    },
    isTOSDisabled() {
      return this.isTOSMandatory
        ? this.home.agreeTermsFlag && this.otp.isValid && this.isValidLength()
        : false;
    },
    isValidLength() {
      return this.otp.hash
        ? this.otp.hash.toString().length === this.otp.maxLength
        : false;
    },
    async fetchOTP(type = 'initial') {
      this.home.phoneCountryCode = this.selectedcountry && this.selectedcountry !== null
          ? this.selectedcountry.value
          : this.countryISDCode;

      if (!this.isResendActive.mobile.timerActive) {
        this.isResendActive.mobile.timerActive = !(type === 'initial');
        this.home.setOTPSection = true;
        this.otp.hash = '';
        try {
          const { otp, uuid } = await CommonService.getOtp({
            mobileCountryCode: this.home.phoneCountryCode,
            mobilePhoneNumber: this.home.phoneNumber,
            emailId:
              this.home.emailAddress && this.home.emailAddress.length > 1
                ? this.home.emailAddress
                : null,
          });

          if (type === 'resend') {
            this.dispatchSnackBar(this.$t('home.otp_resent'), 'success');
            this.otp.isValid = false;
            this.runTimer('mobile', this.otpTimeInterval);
          }
          this.otp.hash = otp;
          const payload = {
            uuid,
            otp,
          };
          this.dispatchToStore('userData/setUserData', payload);

          this.validateOTP(this.isResendActive.mobile.timerActive);
        } catch (e) {
          console.log(e);
          handleError(e);
        }
      }
    },
    formatPhoneNumber(phoneNumber, breakAt = 5, breakChar = ' ') {
      return `00${this.home.phoneCountryCode} ${phoneNumber.substr(
        0,
        breakAt,
      )}${breakChar}${phoneNumber.substr(breakAt, phoneNumber.length)}`;
    },
    runTimer(type, timeInterval) {
      this.isResendActive[type].counter = timeInterval / 1000;
      const timerInterval = setInterval(() => {
        this.isResendActive[type].counter -= 1;
        if (this.isResendActive[type].counter < 1) {
          this.isResendActive[type].timerActive = false;
          clearInterval(timerInterval);
        }
      }, 1000);
    },
    async validateOTP(event, resend = false) {
      const { uuid } = store.getters['userData/userData'];

      if (
        this.otp.hash
        && this.isValidLength()
        && !this.otp.isValid
        && !this.isValidateTriggered
      ) {
        try {
          this.isValidateTriggered = true;
          const { status } = await CommonService.validateOtp({
            clientId: '',
            emailId:
              this.home.emailAddress && this.home.emailAddress.length > 1
                ? this.home.emailAddress
                : null,
            mobileCountryCode: this.home.phoneCountryCode,
            mobilePhoneNumber: this.home.phoneNumber,
            otp: this.otp.hash,
            emailAddress: this.home.emailAddress,
          });

          if (status) {
            this.otp.isValid = true;
            this.home.showInvalidOTP = false;
            this.isResendActive.mobile.disabled = true;
            if (
              !resend
              && this.home.emailAddress !== null
              && this.home.emailAddress !== ''
            ) {
              this.sendEmailVerification();
            }
          } else {
            this.isValidateTriggered = false;
            this.otp.isValid = false;
            this.home.showInvalidOTP = true;
            this.dispatchSnackBar(this.$t('home.otp_wrong'));
          }

          const payload = {
            emailAddress: this.home.emailAddress,
            phoneCountryCode: this.home.phoneCountryCode,
            phoneNumber: this.home.phoneNumber,
            isAuthorized: status,
          };
          this.dispatchToStore('userData/setUserData', payload);
        } catch (e) {
          this.isValidateTriggered = false;
          handleError(e);
        }
      }
    },
    async sendEmailVerification(type = 'initial') {
      if (!this.isResendActive.email.timerActive) {
        this.isResendActive.email.timerActive = !(type === 'initial');
        try {
          const { available } = await CommonService.verifyEmail(
            this.home.emailAddress,
          );

          if (available) {
            const { status } = await CommonService.sendVerificationEmail(
              this.home.emailAddress,
            );

            this.isResendActive.email.disabled = false;
            if (status) {
              if (type === 'resend') {
                this.runTimer('email', this.emailTimeInterval);
              }
              this.dispatchModal(
                this.$t('home.email_verification.content'),
                this.$t('home.email_verification.title'),
                this.$t('common.okay'),
                true,
                false,
                true,
              );
            }
          }
        } catch (e) {
          this.isResendActive.email.timerActive = false;
          this.isResendActive.mobile.timerActive = false;
          handleError(e);
        }
      }
    },
    openTermsAndCondition(event = true) {
      this.termsAndConditionsModel.enabled = event;
    },
    agreeToTermsAndCondition() {
      this.home.agreeTermsFlag = true;
    },
    getOTP() {
      this.home.setOTPSection = true;
      this.fetchOTP();
    },
    dispatchToStore(storeGetter, payLoad) {
      store.dispatch(storeGetter, payLoad);
    },
    redirectToWizard(status = true, message = '', type = 'success') {
      if (status) {
        this.routeToHome(false);
      } else {
        this.dispatchSnackBar(message, type);
      }
    },
    getCountryCodes() {
      CommonService.getCountryCodes()
        .then((res) => {
          console.log(res);
          this.entries = res;
        })
        .catch((err) => {
          console.log(err);
        })
        // eslint-disable-next-line no-return-assign
        .finally(() => (this.isLoading = false));
    },
  },

  watch: {
    searchCountry() {
      if (this.countryCodes.length > 0) return;
      if (this.isLoading) return;
      this.isLoading = true;
      this.getCountryCodes();
    },
  },
};
</script>
