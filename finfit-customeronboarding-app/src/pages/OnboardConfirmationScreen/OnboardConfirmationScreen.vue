/* eslint-disable global-require */
<template>
  <v-app :style="{ background: gradients }" class="onboard-confirm pt-4">
    <v-container
      :class="{ 'onboard-confirm--profile-image': enableProfilePhoto }"
    >
      <v-layout v-if="Boolean(enableProfilePhoto)">
        <div>
          <v-avatar size="130">
            <v-img :src="userData.userPersonelDetails.profilePhoto"></v-img>
          </v-avatar>
        </div>
      </v-layout>

      <v-card>
        <v-container class="text-center">
          <div class="pb-2 pt-2" data-qa="customer-name">
            <font class="headline font-weight-bold"
              >{{ userData.userPersonelDetails.firstName }}
              {{ userData.userPersonelDetails.lastName }}</font
            >
          </div>

          <v-divider class="pa-0"></v-divider>

          <v-layout wrap class="onboard-confirm--customer-details">
            <v-flex class="text-center" xs12 sm4 md4 lg4 xl4>
              <div data-qa="customer-id">
                <v-layout wrap>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font
                      :color="primaryColor"
                      class="subtitle-2 font-weight-medium"
                      >{{
                        $t("onboard_confirmation.account_details.customer_id")
                      }}</font
                    >
                  </v-flex>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font class="subtitle-1 font-weight-medium"
                      >{{ showCustomerId }} 00000464</font
                    >
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <div data-qa="customer-accountNumber">
                <v-layout wrap>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font
                      :color="primaryColor"
                      class="subtitle-2 font-weight-medium"
                      >Savings Account</font
                    >
                  </v-flex>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font class="subtitle-1 font-weight-medium"
                      >{{ showCustomerAccNumber }} 00212102</font
                    >
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
            <v-flex xs12 sm4 md4 lg4 xl4>
              <div data-qa="customer-sortCode">
                <v-layout wrap>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font
                      :color="primaryColor"
                      class="subtitle-2 font-weight-medium"
                      >{{
                        $t("onboard_confirmation.account_details.sortcode")
                      }}</font
                    >
                  </v-flex>
                  <v-flex class="text-left" xs6 sm12 md12 lg12 xl12>
                    <font class="subtitle-1 font-weight-medium">{{
                      bankSortCode
                    }}</font>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>

          <v-divider class="pa-0"></v-divider>

          <v-layout wrap class="pt-2">
            <v-flex class="text-left" xs12 sm12 md9 lg12 xl12>
              <p class="pa-2 subtitle-1 font-weight-regular">
                <!-- {{
                  processData(
                    $t(
                      `onboard.kyc.${getProductType}.${userData.userPersonelDetails.message}.default`
                    )
                  )
                }} -->
                You've been successfully onboarded. As a privileged account
                holder, we'd like to offer a free integrated health & fitness
                management system which will help you to plan your health and
                finances efficiently.
              </p>
            </v-flex>
            <v-row class="pt-10" justify="center">
              <v-btn class="ma-2" outlined color="indigo" @click="loginFinFit">
                Connect your fitness data &nbsp;
                <v-icon left dark class="pr-0">mdi-google-fit</v-icon>
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-card flat tile>
                  <v-container class="grey lighten-4" fluid>
                    <span class="overline"> How does fin-fit work?</span>

                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col cols="12" sm="6" md="4">
                        <v-card>
                          <v-img
                            src="https://developers.google.com/fit/images/homepage-4_856.jpg"
                            height="300px"
                            contain
                          >
                            <!-- <span
                              class="
                                text-h5
                                grey--text
                                pl-4
                                pt-4
                                d-inline-block
                              "
                            >hh</span> -->
                          </v-img>

                          <v-card-actions
                            class="white justify-center"
                            style="overflow-y: auto; height: 100px"
                          >
                            <span class="overline text--deep-purple darken-2"
                              >Sign-up with fin-fit</span
                            >
                          </v-card-actions>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-card>
                          <v-img
                            src="@/assets/cta_banner.png"
                            height="300px"
                            contain
                          >
                            <!-- <span
                              class="
                                text-h5
                                grey--text
                                pl-4
                                pt-4
                                d-inline-block
                              "
                            >hh</span> -->
                          </v-img>

                          <v-card-actions
                            class="white justify-center"
                            style="overflow-y: auto; height: 100px"
                          >
                            <span class="overline text--deep-purple darken-2"
                              >Set your health goals</span
                            >
                          </v-card-actions>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-card>
                          <v-img
                            src="https://developers.google.com/fit/images/homepage-5_856.jpg"
                            height="300px"
                            contain
                          >
                            <!-- <span
                              class="
                                text-h5
                                grey--text
                                pl-4
                                pt-4
                                d-inline-block
                              "
                            >hh</span> -->
                          </v-img>

                          <v-card-actions
                            class="white justify-center"
                            style="overflow-y: auto; height: 100px"
                          >
                            <span class="overline text--deep-purple darken-2"
                              >Gain points & get discounts in financial
                              products</span
                            >
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
                <!-- <v-row justify="center">
                  <img alt="cta" height="auto" src="@/assets/cta_banner.png" />
                </v-row> -->
              </v-col>
            </v-row>
          </v-layout>
        </v-container>
      </v-card>

      <div class="pa-2"></div>

      <v-card class="onboard-confirm--background-color">
        <!-- <v-container>
          <v-divider class="pa-0"></v-divider>
        </v-container> -->
        <v-container class="text-center pt-0">
          <v-layout justify-center>
            <div class="pa-1" xs12 sm12>
              <v-btn
                @click="downloadApp('AndroidURL')"
                color="black"
                class="white--text text-none"
              >
                <v-icon left dark class="pr-2">mdi-android</v-icon>
                <v-layout column class="pa-0">
                  <font class="body-1 font-weight-thin">{{
                    $t("onboard_confirmation.download_app_via.andriod")
                  }}</font>
                </v-layout>
              </v-btn>
            </div>

            <div class="pa-1" xs12 sm12>
              <v-btn
                @click="downloadApp('IosURL')"
                color="black"
                class="white--text text-none"
              >
                <v-icon left dark>mdi-apple</v-icon>
                <v-layout column class="pa-0">
                  <font class="body-1 font-weight-thin">{{
                    $t("onboard_confirmation.download_app_via.ios")
                  }}</font>
                </v-layout>
              </v-btn>
            </div>
          </v-layout>
        </v-container>
      </v-card>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="290">
        <div class="box-outer">
          <v-progress-linear
            indeterminate
            v-if="isLoginActive"
          ></v-progress-linear>
          <div class="box">
            <h2>Sign in</h2>
            <p>to continue to <a>localhost:8080</a></p>
            <form>
              <div class="inputBox" v-if="!isPasswordActive">
                <input
                  type="email"
                  name="email"
                  required
                  onkeyup="this.setAttribute('value', this.value);"
                  v-model="gm.username"
                />
                <label>Email or Phone</label>
              </div>
              <div class="inputBox" v-if="isPasswordActive">
                <input
                  type="password"
                  name="text"
                  required
                  onkeyup="this.setAttribute('value', this.value);"
                  v-model="gm.password"
                />
                <label>Enter your password</label>
              </div>
              <div>
                <p style="text-align: left; font-size: 13px">
                  To continue, Google will share your name, email address,
                  language preference, profile picture and google fit data with
                  localhost:8080
                </p>
              </div>
              <input
                type="button"
                name="sign-in"
                value="Next"
                @click="handleNext()"
              />
            </form>
          </div>
        </div>
      </v-dialog>
    </v-row>
    <v-dialog v-model="confirmDialog" persistent max-width="295">
      <v-card style="padding: 20px 0">
        <div v-if="dataPointActive">
          <div v-if="datapoint.data && datapoint.img">
            <v-card-title class="text-h7 overline justify-center">
              {{ datapoint.data }}
            </v-card-title>
            <v-card-actions class="justify-center">
              <v-img
                contain
                :src="datapoint.img"
                v-if="dataPointActive"
                width="80%"
              />
            </v-card-actions>
          </div>
        </div>
        <template v-else>
          <v-card-text
            >Your google-fit data has been integrated with our banking solution.
            Set the goals and gain points which can then be redeemed against the
            product offered to you</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="confirmDialog = false">
              Continue to bank login
              <v-icon left dark class="pr-0">mdi-google-fit</v-icon>
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import '@/_styles/pages/onboardConfirmationScreen.scss';
import store from '@/_core/store';

export default {
  name: 'dco-onboard-confirmation',
  data() {
    return {
      datapoint: {},
      dataPointActive: true,
      isLoginActive: false,
      isPasswordActive: false,
      gm: {
        username: '',
        password: '',
      },
      confirmDialog: false,
      dialog: false,
      types: ['How it works'],
      cards: ['Signup', 'Earn Points', 'Get Customized financial products'],
      socials: [
        {
          icon: 'mdi-facebook',
          color: 'indigo',
        },
        {
          icon: 'mdi-linkedin',
          color: 'cyan darken-1',
        },
        {
          icon: 'mdi-instagram',
          color: 'red lighten-3',
        },
      ],
      userData: {},
      tabs: null,
      enableProfilePhoto: false,
      labels: ['Products', 'Offers'],
      bankUrl: this.$appSettings.applicationSettings.digitalChannelsWebURL,
      downloadDCViaIosURL:
        this.$appSettings.applicationSettings.digitalChannelsIOSURL,
      downloadDCViaAndroidURL:
        this.$appSettings.applicationSettings.digitalChannelsAndriodURL,
      bankSortCode: this.$appSettings.applicationSettings.bankSortCode,
      showCustomerAccNumber: '',
      showCustomerId: '',
      kycMessageType: '',
      complaintStatus: [
        'KYC_SUCCESS : without restriction',
        'KYC_SUCCESS : with restriction',
      ],
    };
  },
  computed: {
    getProductType() {
      return this.$route.params.productType || '';
    },
  },
  created() {
    this.userData.userPersonelDetails = store.getters['userData/userData'];
    this.userData.userProductDetails = JSON.parse(
      store.getters['appSettings/config'].productInformation,
    );
    this.showCustomerAccNumber = this.userData.userPersonelDetails.ONBOARD_PROSPECT.accountNumber
      || 'Not created';
    this.showCustomerId = this.userData.userPersonelDetails.partyId || 'Not created';
    this.userData.userPersonelDetails.kycStatus ? this.onboardMessage() : false;
    this.enableProfilePhoto = Boolean(
      this.userData.userPersonelDetails.profilePhoto,
    );
  },
  mounted() {
    this.$store.dispatch('appSettings/removeAppConfig');
    this.$store.dispatch('userData/setUserData', {
      isAuthorized: false,
    });
    this.$store.dispatch('appSettings/setAppConfig', {
      message: {
        content: this.$t('onboard.onboard_successful'),
        type: 'success',
        component: 'dco-snackbar',
        timeOut: 2000,
      },
    });
  },
  methods: {
    getdataPoint() {
      let ct = 0;
      const a = [
        {
          data: 'Fetching Steps from Google-fit',
          img: require('@/assets/steps.png'),
        },
        {
          data: 'Fetching exersize data',
          img: require('@/assets/ex.png'),
        },
        {
          data: 'Fetching health data',
          img: require('@/assets/health.png'),
        },
      ];
      const intvv = setInterval(() => {
        this.datapoint = a[ct];
        ct += 1;
        if (ct > a.length) {
          clearInterval(intvv);
          this.dataPointActive = false;
        }
      }, 2000);
    },
    handleNext() {
      if (this.gm.username !== '' && this.gm.password === '') {
        this.isPasswordActive = true;
      } else if (this.gm.username !== '' && this.gm.password !== '') {
        this.isLoginActive = true;
        setTimeout(() => {
          this.dialog = false;
          this.confirmDialog = true;
          this.getdataPoint();
        }, 2000);
      } else {
        this.isPasswordActive = false;
      }
    },
    loginFinFit() {
      this.dialog = true;
      this.isPasswordActive = false;
      this.isLoginActive = false;
      this.dataPointActive = true;
    },
    getImage() {
      const min = 550;
      const max = 560;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    processData(statement) {
      let formattedStmt;
      if (
        this.userData.userPersonelDetails
        && this.userData.userPersonelDetails.productDetails
        && this.userData.userPersonelDetails.productDetails
          .coolingOffDurationPeriod
      ) {
        formattedStmt = statement.replace(
          '{x}',
          this.userData.userPersonelDetails.productDetails
            .coolingOffDurationPeriod,
        );
      } else {
        formattedStmt = statement;
      }
      return formattedStmt;
    },
    openBankUrl() {
      this.$store.dispatch('appSettings/removeAppConfig');

      if (
        this.userData.userPersonelDetails
        && this.userData.userPersonelDetails.dobUrl
      ) {
        window.open(this.userData.userPersonelDetails.dobUrl, '_blank');
      }
    },
    downloadApp(OS) {
      window.open(`${this.downloadDCVia}${OS}`);
    },
    onboardMessage() {
      this.kycMessageType = this.userData.userPersonelDetails.accountNumber
        ? 'default'
        : 'no_account';
    },
  },
};
</script>
<style scoped>
.box-outer {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25rem;
  box-sizing: border-box;
  border: 1px solid #dadce0;
  -webkit-border-radius: 8px;
  border-radius: 8px;
  padding-bottom: 2.5rem;
}
.box {
  padding: 2.5rem;
}

.box h2 {
  margin: 0px 0 -0.125rem;
  padding: 0;
  color: #fff;
  text-align: center;
  color: #202124;
  font-family: "Google Sans", "Noto Sans Myanmar UI", arial, sans-serif;
  font-size: 24px;
  font-weight: 400;
}

.box p {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.1px;
  line-height: 1.5;
  margin-bottom: 35px;
  text-align: center;
}

.box .inputBox {
  position: relative;
}

.box .inputBox input {
  width: 100%;
  padding: 0.825rem 10px;
  font-size: 1rem;
  letter-spacing: 0.062rem;
  margin-bottom: 1.875rem;
  border: 1px solid #ccc;
  background: transparent;
  border-radius: 4px;
}

.box .inputBox label {
  position: absolute;
  top: 0;
  left: 10px;
  padding: 0.625rem 0;
  font-size: 1rem;
  color: grey;
  pointer-events: none;
  transition: 0.5s;
}

.box .inputBox input:focus ~ label,
.box .inputBox input:valid ~ label,
.box .inputBox input:not([value=""]) ~ label {
  top: -1.125rem;
  left: 10px;
  color: #1a73e8;
  font-size: 0.75rem;
  background-color: white;
  height: 10px;
  padding-left: 5px;
  padding-right: 5px;
}
.box .inputBox input:focus {
  outline: none;
  border: 2px solid #1a73e8;
}
.box input[type="button"] {
  border: none;
  outline: none;
  color: #fff;
  background-color: #1a73e8;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  border-radius: 0.312rem;
  font-size: 1rem;
  float: right;
}

.box input[type="button"]:hover {
  background-color: #287ae6;
  box-shadow: 0 1px 1px 0 rgba(66, 133, 244, 0.45),
    0 1px 3px 1px rgba(66, 133, 244, 0.3);
}
</style>
