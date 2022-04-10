<template>
  <div class="onboard-container">
    <dco-wizard
      :wizardConfig="wizardData"
      :componentConfig="config"
      :error="error"
      @componentConfig="getComponentConfig($event)"
      @update="handleWizardInput($event)"
      @save="handleSave($event)"
    />
    <dco-modal
      v-if="onboard.modal.enabled"
      @save="redirectOnConfirm"
      :config="onboard.modal"
    >
      <div slot="modalContent" class="text-center">
        <div class="text-center py-8">
          <v-avatar v-if="onboard.onboardSuccess">
            <v-icon size="100" color="green">mdi-checkbox-marked-circle</v-icon>
          </v-avatar>
          <v-avatar v-if="!onboard.onboardSuccess">
            <v-icon size="100" color="red">mdi-close-circle</v-icon>
          </v-avatar>
        </div>
        <div>
          <span class="title font-weight-medium">{{
            onboard.onboardStatus
          }}</span>
        </div>
      </div>
    </dco-modal>
  </div>
</template>

<script>
import Wizard from '@/components/DCO-Wizard/Wizard.vue';
import CommonService from '@/_core/services/commonService';
import handleError from '@/_core/helpers/errorHandler';
import events from '@/_core/helpers/event';
import rulesMixin from '@/_core/mixins/rulesMixin';
import routeMixin from '@/_core/mixins/routeMixin';
import store from '@/_core/store';

export default {
  name: 'Onboard',
  components: {
    'dco-wizard': Wizard,
    'dco-modal': () => import('@/components/DCO-Modal/Modal.vue'),
  },
  mixins: [rulesMixin, routeMixin],
  data() {
    return {
      isCredentialsPage: false,
      isReviewsPage: false,
      componentName: 'flowConfiguration',
      wizardData: {
        steps: undefined,
        settings: {},
      },
      config: {},
      customerId: undefined,
      inputSchema: undefined,
      error: false,
      onboard: {
        onboardSuccess: true,
        onboardStatus: '',
        modal: {
          enabled: false,
          saveButton: this.$t('common.okay'),
          title: this.$t('onboard.onboard_status'),
          width: '500px',
          persistent: true,
        },
      },
      incomingObj: [],
    };
  },
  mounted() {
    this.getWizardSteps();
  },
  methods: {
    getComponentConfig({ components }) {
      const excludeComponent = ['ReviewDetailsAndConsent'];
      components.forEach((component) => {
        const len = components.filter(
          comp => isNaN(comp.schemaName) === true,
        );
        const { name, validation, schemaName } = component;

        if (
          isNaN(schemaName)
          && !excludeComponent.includes(name)
          && this.inputSchema !== schemaName
        ) {
          this.error = true;
          this.getComponentSchema(
            name,
            schemaName.replace(/\s/g, ''),
            validation,
            Boolean(len.length - 1),
          );
          this.inputSchema = schemaName;
        } else if (excludeComponent.includes(name)) {
          this.error = false;
          this.config.model = store.getters['userData/userData'];
        } else {
          this.config.model = store.getters['userData/userData'];
        }
      });
    },
    async getWizardSteps() {
      try {
        const stepSchema = await CommonService.getComponentConfig(
          this.componentName,
        );
        this.wizardData = stepSchema;
        this.setStoreData({ componentSchema: stepSchema });
        this.wizardData.settings.vertical = this.wizardData.settings.vertical; // this.isMobileDevice() ||
        this.wizardData.settings.isMobileDevice = false; // this.isMobileDevice() ||
      } catch (e) {
        handleError(e);
      }
    },
    async getComponentSchema(
      componentName,
      formName,
      validationState,
      multiPart,
    ) {
      this.incomingObj.push(formName);
      this.config = {};
      try {
        const componentSchema = await CommonService.getComponentSchema(
          componentName,
          formName,
          validationState,
        );
        const storeData = store.getters['userData/userData'];
        const { lastUpdatedStepIdentifierIndex, applicationStatus } = storeData;
        const hasData = Object.keys(componentSchema.model).some(
          Object.prototype.hasOwnProperty.bind(storeData),
        );

        if (hasData) {
          const model = Object.assign(
            {},
            componentSchema.model,
            store.getters['userData/userData'],
          );

          Object.keys(model).filter((k) => {
            if (!componentSchema.model.hasOwnProperty(k)) {
              delete model[k];
            }
          });
          componentSchema.model = model;
        }
        this.config = !multiPart
          ? { [formName]: componentSchema }
          : Object.assign(this.config, { [formName]: componentSchema });
        this.config.store = Object.assign(
          store.getters['appSettings/config'],
          store.getters['userData/userData'],
        );
        this.wizardData.settings.stepperState = applicationStatus !== 'SIGNOFF'
            ? lastUpdatedStepIdentifierIndex
            : lastUpdatedStepIdentifierIndex + 1;
        if (formName === this.incomingObj[this.incomingObj.length - 1]) {
          setTimeout(
            () => events.$emit('loadForm', { config: this.config, name: formName }),
            150,
          );
        }
      } catch (e) {
        handleError(e);
      }
    },
    isMobileDevice: () => store.getters['appSettings/config'].isMobile,
    async handleWizardInput(userInput) {
      if (
        !userInput.data.password
        && !this.isCredentialsPage
        && !userInput.data.appConsent
        && !this.isReviewsPage
      ) {
        events.$emit('userInput', true);
      } else {
        this.isCredentialsPage = true;
        this.isReviewsPage = true;
      }

      const { data } = store.getters['userData/userData'];
      if (!store.getters['userData/userData'][userInput.schemaName]) {
        Object.assign(store.getters['userData/userData'], {
          [userInput.schemaName]: {},
        });
      } else {
        const schemaObj = { ...userInput.data };
        delete schemaObj.applicationStatus;
        store.getters['userData/userData'][userInput.schemaName] = schemaObj;
      }

      this.setStoreData({
        ...data,
        ...userInput.data,
        state: userInput.state,
        display: userInput.display,
      });
    },
    handleSave(event) {
      const {
 flag, redirect, keyMap, init,
} = event;
      let message;
      let title;
      let onSave;

      if (redirect) {
        const type = {
          CREATE_APPLICATION: [
            'onboard.resume_later_msg',
            'common.continue_later',
            'saveToAppData',
          ],
          ABORT: [
            'onboard.abort.modal.content',
            'onboard.abort.modal.title',
            'abortApplication',
          ],
        };

        if (flag === 'CONFIRM_ONBOARD') {
          this.redirectOnConfirm();
          return;
        }
        message = this.$t(`${type[flag][0]}`);
        title = this.$t(`${type[flag][1]}`);
        // eslint-disable-next-line prefer-destructuring
        onSave = type[flag][2];

        store.dispatch('appSettings/setAppConfig', {
          message: {
            content: message,
            type: 'success',
            component: 'dco-modal',
            title,
            saveCallback: this[onSave],
            saveButton: this.$t('common.yes'),
            cancelButton: this.$t('common.no'),
            cancelCallback: this.cancelSave,
          },
        });
      } else {
        this.intiateCreate(flag, keyMap, init);
      }
    },
    async abortApplication() {
      const customerData = store.getters['userData/userData'];
      await CommonService.abortApplication(customerData);
      this.routeToHome();
    },
    redirectOnConfirm() {
      // if (this.error) {
      const {
        productCode,
        productType,
        termUnit,
        productTerm,
      } = this.$store.getters['appSettings/config'];
      if (productType && productCode) {
        // eslint-disable-next-line no-restricted-globals
        const setProductTerm = isNaN(productTerm)
          ? productTerm
          : `${productTerm}${termUnit}`;
        const redirectUrl = productTerm
          ? `/confirmOnboard/${productType}/${productCode}/${setProductTerm}`
          : `/confirmOnboard/${productType}/${productCode}/M`;

        this.$router.push(redirectUrl);
        this.onboard.modal.enabled = false;
      }
      // } else {
      //   location.reload();
      // }
    },
    async saveToAppData() {
      let response;
      const customerData = store.getters['userData/userData'];

      try {
        response = await CommonService.verifyAndCreateCustomer(
          'CREATE_APPLICATION',
          customerData,
        );
        if (response) {
          this.setStoreData(Object.assign(customerData, response));
          this.dispatchSnackBar(this.$t('onboard.save_success'), 'success');
          this.routeToHome(true, false);
        }
      } catch (e) {
        handleError(e, 'CREATE_APPLICATION_FAILURE', true);
      }
    },
    async intiateCreate(type, keyMap = undefined, init = false) {
      let personalCustomerObj;
      const customerData = store.getters['userData/userData'];
      const { applicationId } = customerData;

      if (init && applicationId) {
        return;
      }
      try {
        personalCustomerObj = await CommonService.verifyAndCreateCustomer(
          type,
          customerData,
        );

        if (personalCustomerObj) {
          events.$emit('actionCompleted', { type });
          this.error = true;
          this.$store.dispatch('userData/setUserData', {
            [type]: personalCustomerObj,
          });
          this.setStoreData(Object.assign(customerData, personalCustomerObj));
          this.processVerifyAndCreateCustomer(type, personalCustomerObj);
        } else {
          this.error = false;
        }
      } catch (e) {
        handleError(e);
      }
    },
    processVerifyAndCreateCustomer(type, personalCustomerObj) {
      const { status } = personalCustomerObj;

      if (status && type === 'CREATE_PASSWORD') {
        this.onboard.onboardStatus = this.onboard.onboardSuccess
          ? this.$t('onboard.onboard_successful')
          : this.$t('onboard.onboard_unsuccessful');
        this.redirectOnConfirm();
      }
    },
    setStoreData(payload) {
      store.dispatch('userData/setUserData', payload);
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
  },
};
</script>
