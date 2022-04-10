<template>
  <div class="footer">
    <v-divider />
    <v-flex class="pa-sm-0">
      <v-card flat class="">
        <!-- <v-footer
          v-if="isFooterActive(config.index, config.state)"
          light
          fixed
          class="pa-1"
        > -->
        <v-layout row wrap>
          <v-flex>
            <v-card-actions class="justify-center" style="min-height: 50px">
              <v-tooltip :disabled="Boolean(isMobileScreen)" left>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="pr-9">
                    <v-btn
                      :disabled="isFirstIndex(config.index) || config.state > 4"
                      fab
                      v-on="on"
                      @click="decrementStep"
                      class="decrement white--text font-weight-regular"
                      data-qa="previous-step"
                      small
                      :color="primaryColor"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                  </div>
                </template>
                <span> {{ $t("stepper.footer.tooltip_back") }} </span>
              </v-tooltip>
              <!-- <v-spacer/> -->
              <!-- <v-btn
                    :disabled="isFrozen() || isPendingFrozen()"
                    :color="primaryColor"
                    dark
                    rounded
                    medium
                    @click="continueLater"
                    class="continue subtitle-1 text-capitalize font-weight-regular"
                    data-qa="save-continue"
                  > {{ $t('stepper.footer.saveAndExit') }} </v-btn>
                  <v-spacer /> -->
              <v-tooltip :disabled="Boolean(isMobileScreen)" right>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="pl-9">
                    <v-btn
                      @click="incrementStep(config.index)"
                      :disabled="validForm"
                      class="increment white--text font-weight-regular"
                      data-qa="next-step"
                      fab
                      small
                      :color="primaryColor"
                    >
                      <v-icon :color="greyColor">mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </template>
                <span> {{ $t("stepper.footer.tooltip_next") }} </span>
              </v-tooltip>
            </v-card-actions>
          </v-flex>
        </v-layout>
        <!-- </v-footer> -->
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import '@/_styles/components/stepperfooter.scss';
import events from '@/_core/helpers/event';
import store from '@/_core/store';
import CommonService from '@/_core/services/commonService';

export default {
  name: 'step-footer',
  props: {
    config: {
      type: Object,
      default: undefined,
    },
    error: {
      type: Boolean,
    },
  },
  data: () => ({
    consentScreen: false,
    formValidityState: false,
    validForm: true,
    trigger: false,
    excludeStates: ['KYC PENDING', 'KYC NONCOMPLIANT'],
    hasDelay: false,
    isIncremented: false,
    isLastStep: false,
    credentialsActive: false,
    isMobileScreen: store.getters['appSettings/config'].isMobile,
  }),
  methods: {
    continueLater() {
      this.$emit('continue', { flag: 'CREATE_APPLICATION', redirect: false });
    },
    async getEmailVerificationStatus(emailId) {
      const invalidEmailStates = ['PENDING', 'No entry found'];
      const { status } = await CommonService.verifyEmailStatus(emailId);

      if (status && !invalidEmailStates.includes(status)) {
        setTimeout(() => this.customerActions('ONBOARD_PROSPECT'), 1000);
      } else {
        store.dispatch('appSettings/setAppConfig', {
          message: {
            content: this.$t(`home.email_verify.${status}`),
            type: 'error',
            component: 'dco-snackbar',
          },
        });
        this.validForm = false;
      }
    },
    incrementStep(index) {
      const {
        status: onBoardStatus,
        password,
        emailAddress,
        emailUpdateOnReview,
      } = store.getters['userData/userData'];
      const count = this.excludeStates.includes(status)
        && this.config.steps.length - 1 === index + 1
          ? 2
          : 1;
      const { route } = this.config.steps[index] || { route: '' };

      this.validForm = true;
      this.isIncremented = true;

      if (onBoardStatus && onBoardStatus === '001') {
        if (password) {
          this.customerActions('CREATE_PASSWORD');
          return;
        }
        this.credentialsActive = true;
        this.$emit('changeStepperIndex', {
          state: 'increment',
          count: index - (index - 1),
        });
        return;
      }

      if (!(this.config.steps.length - 1 === index + 1)) {
        this.$emit('changeStepperIndex', {
          state: 'increment',
          count: index === 0 ? 1 : index - (index - 1),
        });
        if (password) {
          this.customerActions('CREATE_PASSWORD');
          return;
        }
        this.continueLater();
      }
      if (route) {
        switch (true) {
          case route === 'ReviewAndConsent':
            if (this.consentScreen) {
              if (emailUpdateOnReview) {
                this.getEmailVerificationStatus(emailAddress);
              } else {
                setTimeout(
                  () => this.customerActions('ONBOARD_PROSPECT'),
                  1000,
                );
              }
            }
            break;

          case route === 'CreateCredentials':
            if (password) {
              setTimeout(() => this.customerActions('CREATE_PASSWORD'), 500);
            }
            break;

          default:
            window.scrollTo(0, 0);
            this.$emit('changeStepperIndex', { state: 'increment', count: 0 });
        }
      }
    },
    decrementStep() {
      window.scrollTo(0, 0);
      this.isIncremented = false;
      this.$emit('changeStepperIndex', { state: 'decrement', count: 1 });
    },
    isFrozen() {
      return this.config.applicationStatus === 'SIGNOFF';
    },
    isPendingFrozen() {
      return (
        this.config.applicationStatus === 'PENDING_SIGNOFF'
        || this.config.applicationStatus === 'CREATE_CREDENTIALS'
      );
    },
    customerActions(flag, redirect = false, keyMap = undefined) {
      this.$emit('continue', { flag, redirect, keyMap });
      this.trigger = true;
    },
    execAfterLastStep() {
      this.customerActions('CREATE_PASSWORD');
      this.isLastStep = true;
    },
    isFirstIndex: index => index === 0,
    isLastIndex: (index, steps) => (steps ? index === steps.length - 1 : false),
    isFooterActive: (index, stepperState) => stepperState === index + 1,
  },
  created() {
    events.$on('actionCompleted', (arg) => {
      const { type } = arg;

      if (type === 'ONBOARD_PROSPECT') {
        this.incrementStep(3);
      }
    });
    events.$on('formValidity', (arg) => {
      this.formValidityState = arg;
    });
    events.$on('userInput', (arg) => {
      if (!arg) {
        return;
      }

      if (this.config.state < 3) {
        this.consentScreen = false;
      }
      if (this.config.state === 4 && arg.hasOwnProperty('credentials')) {
        if (arg && arg.credentials) {
          this.validForm = !arg.credentials;
        } else {
          this.validForm = true;
        }
        return;
      }

      if (!arg.consent) {
        this.consentScreen = false;
        this.validForm = true;
      }
      this.validForm = true;
      if (
        this.config.state === 3
        && arg.consent
        && arg.consent.productTermsAcceptedFlag
      ) {
        this.consentScreen = true;
        this.validForm = false;
      } else {
        this.consentScreen = false;
        this.validForm = true;
      }

      const currentComponentObj = this.config.steps[this.config.state - 1];
      const upcomingComponentObj = this.config.steps[this.config.state];
      let componentExist = Object.keys(this.config.component);
      componentExist = componentExist.filter(k => k !== 'store');

      if (
        this.config
        && this.config.component
        && this.config.component[Object.keys(this.config.component)[0]]
        && this.config.component[Object.keys(this.config.component)[0]].schema
        && this.config.state < 4
      ) {
        let activeSchema;

        if (componentExist.length > 1) {
          activeSchema = JSON.parse(
            JSON.stringify(this.config.component[componentExist[0]].schema),
          );
          Object.assign(
            activeSchema,
            this.config.component[componentExist[1]].schema,
          );
        } else {
          activeSchema = this.config.component[Object.keys(this.config.component)[0]].schema;
        }
        const requiredElems = Object.keys(activeSchema).filter(
          schemaKey => activeSchema[schemaKey].id === 'required',
        );

        if (
          store.getters['userData/userData']
          && store.getters['userData/userData'][
            Object.keys(this.config.component)[0]
          ]
        ) {
          let activeSetValue;

          if (componentExist.length > 1) {
            activeSetValue = JSON.parse(
              JSON.stringify(
                store.getters['userData/userData'][componentExist[0]],
              ),
            );
            Object.assign(
              activeSetValue,
              store.getters['userData/userData'][componentExist[1]],
            );
          } else {
            activeSetValue = store.getters['userData/userData'][
                Object.keys(this.config.component)[0]
              ];
          }

          const removeArr = ['', null];
          const keySet = Object.keys(activeSetValue);

          const valueSet = [];
          const requiredKeySet = keySet.filter((elem) => {
            if (
              requiredElems.includes(elem)
              && !removeArr.includes(activeSetValue[elem])
            ) {
              valueSet.push(activeSetValue[elem]);
            }
          });

          if (valueSet.length >= requiredElems.length) {
            this.validForm = !this.formValidityState;
          } else {
            this.validForm = true;
          }
        }
      }
    });
  },
  watch: {
    config() {
      if (this.config.navigate) {
        this.isIncremented = false;
      } else {
        this.isIncremented = true;
      }
    },
    error(currentError, prevError) {
      if (this.hasDelay && this.isIncremented && !this.isLastStep) {
        this.incrementStep(this.config.index);
      }
      this.hasDelay = !!prevError;
    },
  },
};
</script>
