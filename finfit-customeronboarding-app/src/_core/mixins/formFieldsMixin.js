/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import moment from 'moment';
import CommonService from '@/_core/services/commonService';
import {
  required,
  pattern,
} from '@/_core/helpers/validationRules';
import store from '@/_core/store';
import events from '@/_core/helpers/event';

const formFieldsMixin = {
  data() {
    return {
      ebavUnderWay: false,
      underProcess: false,
      isFileGot: undefined,
      rule: undefined,
      ruleLength: undefined,
      label: undefined,
      attempts: 0,
      previoussortCode: undefined,
      previousAccountNumber: undefined,
      isValidAccountNumber: {},
      enableAccountVerification: false,
      banksortCode: undefined,
      autoTriggerEbav: false,
      dateUIFormat: undefined,
      isApiTriggered: false,
      isNationalIdDocument: false,
    };
  },
  created() {
    this.enableAccountVerification = this.$appSettings.defaultConfigurations.enableAccountVerification;
    this.banksortCode = this.$appSettings.applicationSettings.banksortCode;
    this.dateUIFormat = this.$appSettings.defaultConfigurations.dateFormat ? this.$appSettings.defaultConfigurations.dateFormat.uiFormat : 'DD-MM-YYYY';
  },
  methods: {
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
    async checkFormSanity(schema, model) {
      const fileUploadKey = this.getEnabledKey(schema, 'fieldValidation-icon');
      const dateFormatKey = this.getEnabledKey(schema, 'format');
      const fileKey = this.getEnabledKey(schema, 'entityCode');
      const disableAddressKey = this.getEnabledKey(schema, 'disable-on-exist');
      const invalidFieldState = (Object.keys(schema).filter(key => model[key]).length > 0);
      // this.isNationalIdDocument = (fileUploadKey == 'nationalIdNumber') ? true : false

      if (this.arg.config.store) {
        const {
          file,
          addressID,
          manualAddress,
          excludeFields,
          verificationStatus,
          returnCustomer,
          isValidateTriggered,
          lastUpdatedStepIdentifierIndex,
          accountNumber,
          sortCode,
          ebav,
          accountVerifiedFlag,
          ebavDataObj,
        } = this.arg.config.store;


        setTimeout(() => {
          if (ebav
            && ebav.ebavAccountNumber
            && ebav.ebavStatus === 'Success'
            && this.arg.config[this.config.name].schema.accountNumber
          ) {
            this.arg.config[this.config.name].schema.accountNumber.appendIcon = 'mdi-checkbox-marked-circle green--text';
          }
          if (this.$refs.form && invalidFieldState && returnCustomer && !isValidateTriggered && (lastUpdatedStepIdentifierIndex === this.config.state)) {
            Object.keys(schema).forEach((key) => {
              if ('rules' in schema[key] && schema[key].rules.length > 0) {
                this.validateRegEx({ schema, key });
              }
            });
            this.$refs.form.validate();
          }
        });

        if (
          schema[fileKey]
          && schema[fileKey].trigger === 'accountNumber'
          && this.arg.config.store.hasOwnProperty('accountVerifiedFlag')
          && ebavDataObj
        ) {
          const status = accountVerifiedFlag ? 'SUCCESS' : 'FAILURE';

          this.displayEbavStatus(status);
        }

        if (disableAddressKey && addressID && addressID.length > 1) {
          // if (document.getElementById("addressLine2")) {
          document.getElementsByClassName('countryInput')[0].blur();
          // }
          const disabledArr = disableAddressKey.split(',');
          disabledArr.forEach((elem) => {
            if (model[elem] !== null && model[elem].length > 1 && addressID.length > 1) {
              schema[elem].readonly = true;
            }
          });
        }

        if (fileKey.length) {
          if (!this.isFileGot) {
            this.isFileGot = true;
            const file = await this.getDocument(schema[fileKey].entityCode, this.arg.config.store.entityId);
          }
          if (this.arg.config.store[schema[fileKey].entityCode]) {
            this.persistData = this.arg.config.store[schema[fileKey].entityCode];
          }

          this.componentInput = fileKey;
          if (schema[fileKey]
            && schema[fileKey].trigger === 'accountNumber'
            && this.$store.getters['userData/userData'][schema[fileKey].entityCode]
            && this.$store.getters['userData/userData'][schema[fileKey].entityCode].document
          ) {
            const customerDataObj = JSON.parse(JSON.stringify(this.$store.getters['userData/userData']));
            const appData = CommonService.assembleForAppData(customerDataObj);
            const customerDetails = {
              contactInformationDTO: JSON.parse(appData.contactInformation),
              personalInformationDTO: JSON.parse(appData.personalInformation),
            };
            if (JSON.stringify(customerDetails) === JSON.stringify(this.$store.getters['userData/userData'].ebavDataObj)) {
              this.displayEbavStatus('FAILURE');
              // Object.assign(this.arg.config[this.config.name].model, {
              //   [fileKey]: "uploaded",
              // });
              // this.emitUpdated(this.arg.config[this.config.name].model);
            } else {
              this.verifyAccountNumber({
                data: {
                  sortCode,
                  accountNumber,
                },
                obj: { schema },
                key: 'accountNumber',
              });
            }
          } else {
            if (schema[fileKey].trigger === 'accountNumber') {
              if (accountNumber && sortCode && !this.underProcess) {
                this.underProcess = true;
                this.verifyAccountNumber({
                  data: {
                    sortCode,
                    accountNumber,
                  },
                  obj: { schema },
                  key: 'accountNumber',
                });
              }
              return;
            }
            this.componentInput = fileKey;
            this.enableComponent = true;
            this.label = schema[fileKey].label;
            this.component = 'file-upload';
            this.entityCode = schema[fileKey].entityCode;
            this.key = fileKey;
          }
        }

        if (dateFormatKey.length && !this.isDataPreloaded) {
          this.formatDate(this.arg.config.store[dateFormatKey], dateFormatKey);
        }
        if (manualAddress) {
          this.toggleManual(Object.keys(schema), false);
        } else if (manualAddress === false) {
          this.toggleManual(excludeFields, false);
        }

        this.isDataPreloaded = true;
      }
      this.toggleEnable(schema, model);
      this.validateField(schema, model);
      this.autoFill(schema, model);
      this.toggleLabel(schema, model);
    },
    validateField(schema, model) {
      Object.keys(schema).forEach((key) => {
        const mandateKey = schema[key]['conditional-mandate-disable'];
        if (mandateKey) {
          if (model[key] && model[mandateKey]) {
            this.validateRegEx({ schema, key: mandateKey });
          } else if (model[key]) {
            delete schema[mandateKey].rules;
            delete schema[mandateKey].id;
            this.applyInputRules(schema, key, schema[key]['data-relation-rules'], true);
            this.validateRegEx({ schema, key });
          }
        }
      });
    },
    displayEbavStatus(status) {
      const stateArr = ['INVALIDDATA', 'FAILURE', 'PROCESSING_ERROR', 'SERVICEVALIDATIONERROR'];

      if (status) {
        if (stateArr.includes(status)) {
          this.$store.dispatch('userData/setUserData', {
            accountVerifiedFlag: false,
          });
          this.arg.config[this.config.name].schema.accountNumber.appendIcon = 'mdi-close-circle red--text';
          this.componentInput = 'accountProof';
          this.enableComponent = true;
          this.label = this.arg.config[this.config.name].schema.accountProof.label;
          this.component = 'file-upload';
          this.entityCode = this.arg.config[this.config.name].schema.accountProof.entityCode;
          this.key = 'accountProof';
        } else if (status === 'SUCCESS') {
          this.enableComponent = false;
          Object.assign(this.arg.config[this.config.name].model, {
            accountProof: 'uploaded',
          });
          this.emitUpdated(this.arg.config[this.config.name].model);
          this.$store.dispatch('userData/setUserData', {
            accountVerifiedFlag: true,
            ebav: {
              ebavAccountNumber: this.arg.config[this.config.name].model.accountNumber,
              ebavStatus: 'Success',
            },
          });
          this.arg.config[this.config.name].schema.accountNumber.appendIcon = 'mdi-checkbox-marked-circle green--text';
        }
      }
    },
    async verifyAccountNumber({ data, key, obj }) {
      const checkFor = ['accountNumber']; // sortCode
      const { schema } = obj;

      if (checkFor.includes(key) && this.valid && !this.ebavUnderWay) {
        if (data.sortCode.length && data.accountNumber.length) {
          this.ebavUnderWay = true;
          if (this.attempts < 3) {
            this.attempts += 1;
            const customerData = this.$store.getters['userData/userData'];
            const response = await CommonService.verifyExternalAccount(customerData);

            if (response && response.data.status) {
              this.ebavUnderWay = false;
              this.$store.dispatch('userData/setUserData', { ebavDataObj: response.customerDetails });
              this.isValidAccountNumber = response.data.status;
              this.displayEbavStatus(response.data.status);
            }
          } else {
            this.displayErrorMessage('dco-modal', this.$t('form.invalid_accountNumber_message'));
          }
        }
      }
    },
    displayErrorMessage(component, content) {
      this.$store.dispatch('appSettings/setAppConfig', {
        message: {
          content,
          type: 'error',
          component,
          timeOut: 3000,
          title: this.$t('form.invalid_accountNumber_attempts_message'),
          saveButton: this.$t('common.okay'),
          saveCallback: this.routeToHome,
          close: false,
          persistent: true,
        },
      });
    },

    handleProcessingErrorScnerio(schema, key, displayText, enableComponent) {
      this.displayErrorMessage('dco-snackbar', displayText);
      schema[key].appendIcon = (schema[key]['fieldValidation-icon']) ? 'mdi-close-circle red--text' : '';
      this.enableComponent = enableComponent;
      this.component = 'file-upload';
      this.key = 'accountNumber';
    },
    handleFailureScnerio(schema, key, displayText, enableComponent) {
      this.displayErrorMessage('dco-snackbar', displayText);
      schema[key].appendIcon = (schema[key]['fieldValidation-icon']) ? 'mdi-close-circle red--text' : '';
      this.enableComponent = enableComponent;
      this.component = 'file-upload';
      this.key = 'accountNumber';
    },
    formatDate(inputDate, key, update = true, inputFormat = 'YYYY-MM-DD', outputFormat = this.dateUIFormat) {
      let formatedDate;
      const date = new Date(inputDate);
      const validateDateFormat = moment(inputDate, outputFormat, true).isValid(); // validating the 'inputDate' against 'outputFormat' format

      if (isNaN(inputDate) && date.toString() !== 'Invalid Date' && inputDate.length > 9) {
        if (!validateDateFormat) {
          formatedDate = moment(inputDate, inputFormat).format(outputFormat);
        }

        if (update) {
          this.arg.config[this.config.name].model[key] = validateDateFormat ? inputDate : formatedDate;
          this.$emit('update', this.arg.config[this.config.name].model);
        }
      }

      return formatedDate;
    },
    toggleDisable(model, { obj, schema, value }) {
      const schemaRelation = obj.schema['data-relation'];
      const schemaRelationRules = obj.schema['data-relation-rules'];
      const schemaDynRegex = obj.schema['data-dynRegex'];

      if (schemaRelation && !schemaDynRegex) {
        this.applyInputRules(schema, schemaRelation, schemaRelationRules, value);
        schema[schemaRelation].hidden = !value;
        schema[schemaRelation].id = value ? 'required' : '';
        // this.arg.config[this.config.name].model[schemaRelation] = '';
        // Object.assign(this.arg.config[this.config.name].model, { [schemaRelation]: '' });
        this.emitUpdated(this.arg.config[this.config.name].model);
        console.log(this.$store.getters['userData/userData']);
        // this.$store.dispatch('userData/setUserData', { [schemaRelation]: '' });
        events.$emit('formValidity', !value);
        this.$refs.form.resetValidation();
      }
    },
    applyInputRules(schema, schemaRelation, schemaRelationRules, value) {
      const applicableRules = ['required'];
      if (!('rules' in schema[schemaRelation])) {
        Object.assign(schema[schemaRelation], { rules: [] });
      }
      schemaRelationRules.forEach((rule, index) => {
        if (applicableRules.includes(rule)) {
          schema[schemaRelation].id = (value) ? rule : '';
          schema[schemaRelation].rules[index] = (value) ? required('Required') : '';
        }
      });
    },
    toggleEnable(schema, model) {
      if (schema && model) {
        Object.keys(schema).forEach((key) => {
          if (schema[key]['data-relation'] && model[key] && !schema[key]['data-dynRegex']) {
            schema[schema[key]['data-relation']].hidden = false;
            this.applyInputRules(schema, schema[key]['data-relation'], schema[key]['data-relation-rules'], model[key]);
          }
        });
      }
    },
    toggleManual(keys, flag = true) {
      const { manualAddress, excludeFields } = this.arg.config.store;

      if (keys) {
        // eslint-disable-next-line
        Object.keys(this.arg.config[this.config.name].schema).filter((schemaKey) => {
          if (keys.includes(schemaKey)) {
            this.arg.config[this.config.name].schema[schemaKey].readonly = flag;
            if (excludeFields && manualAddress === false) {
              excludeFields.forEach((key) => {
                delete this.arg.config[this.config.name].schema[key].rules;
                const { model } = this.arg.config[this.config.name];
                if (model[key]) {
                  this.validateRegEx({ schema: this.arg.config[this.config.name].schema, key });
                }
              });
            }
          }
        });
      }
    },
    mapAddressKeys(actual, replace) {
      // eslint-disable-next-line max-len
      return Object.keys(replace).map(key => ({ [replace[key] || key]: actual[key] })).reduce((a, b) => Object.assign({}, a, b));
    },
    validateRegEx({ schema, key }) {
      if (schema) {
        if (key in schema) {
          const { regex } = schema[key];
          if (!('rules' in schema[key])) {
            Object.assign(schema[key], { rules: [] });
          }
          if (regex) {
            schema[key].rules[5] = pattern(regex);
          }
        }
      }
    },
    toggleLabel(schema, model) {
      const filteredKey = Object.keys(schema).filter(key => schema[key].hasOwnProperty('data-dynRegex')).toString();
      const piggyBackKey = Object.keys(schema).filter(key => schema[key].hasOwnProperty('data-piggyback')).toString();

      if (filteredKey && model[filteredKey] && schema[filteredKey] && schema[filteredKey].items) {
        const filterVal = (schema[filteredKey].items).filter(item => item.entityCode === model[filteredKey])[0].entityName;
        this.$store.dispatch('userData/setUserData', { identifierLabel: filterVal });
        if (piggyBackKey) {
          this.$store.dispatch('userData/setUserData', { nationalIdTypeCode: filterVal });
          model.nationalIdTypeCode = filterVal;
        }
        schema[schema[filteredKey]['data-relation']].label = filterVal;
      }
    },
    toggleRegex({
      schema, obj, value, key, data,
    }) {
      if (obj.schema['data-dynRegex']) {
        const regexObj = obj.schema['data-regex'];
        const dataRel = obj.schema['data-relation'];

        if (!regexObj[value].regex) {
          return;
        }
        this.rule = { [dataRel]: regexObj[value].regex };
        this.toggleLabel(schema, data);
        this.arg.config[this.config.name].model[dataRel] = '';
        this.$refs.form.resetValidation();
        // eslint-disable-next-line no-prototype-builtins
      } else if (this.rule && this.rule.hasOwnProperty(key)) {
        this.ruleLength = (!this.ruleLength) ? schema[key].rules.length : this.ruleLength;
        schema[key].rules[this.ruleLength] = pattern(this.rule[key]);
      }
    },
    autoFill(schema, model) {
      const filteredKey = Object.keys(schema).filter(key => schema[key].autoFill).toString();

      if (filteredKey && schema[filteredKey].autoFill['data-relation-value']) {
        const aKey = Object.keys(schema[filteredKey].autoFill['data-relation-value']).toString();
        const aVal = Object.values(schema[filteredKey].autoFill['data-relation-value']).toString();

        if (this.arg.config.store[aKey] === aVal) {
          model[filteredKey] = this.arg.config.store[schema[filteredKey].autoFill['data-relation']];
          schema[filteredKey].disabled = true;
          this.$store.dispatch('userData/setUserData', { [filteredKey]: this.arg.config.store[schema[filteredKey].autoFill['data-relation']] });
        }
      } else if (filteredKey) {
        model[filteredKey] = this.arg.config.store[schema[filteredKey].autoFill['data-relation']];
        schema[filteredKey].disabled = true;
        this.$store.dispatch('userData/setUserData', { [filteredKey]: this.arg.config.store[schema[filteredKey].autoFill['data-relation']] });
      }
    },
    clearInputFields(e) {
      const { fields, enable } = e;
      if (enable) {
        fields.forEach((item) => {
          this.arg.config[this.config.name].model[item] = '';
        });
        this.$emit('update', this.arg.config[this.config.name].model);
        this.toggleManual(fields, !enable);
        this.$refs.form.resetValidation();
      } else {
        this.toggleManual(fields, !enable);
      }
    },
    async uploadRelatedDocuments({
 file = undefined, entityId, key, data, schema,
}) {
      if (
        file
        && file.size
        && file.name
        && schema.entityCode
        && (!this.$store.getters['userData/userData'].docUploads
          || !this.$store.getters['userData/userData'].docUploads.includes(schema.entityCode))
      ) {
        const docUploads = [];
        docUploads.push(schema.entityCode);
        this.$store.dispatch('userData/setUserData', { docUploads });

        const [dataArr] = await CommonService.getDropdownObj(
          `lookupValuesByEntityCode?entityCode=${schema.entityCode}`,
        );
        const {
          entityId: documentSubCategoryId,
          parentEntityId: documentCategoryId,
        } = dataArr;
        const form = new FormData();

        form.append('document', file);
        form.append('documentCategoryId', documentCategoryId);
        form.append('applicationId', entityId);
        form.append('documentSubCategoryId', documentSubCategoryId);
        form.append('version', 1);
        try {
          const response = await CommonService.documentUpload(form);
          if (response.documentStatus === 'SAVED') {
            data[key] = 'fileuploaded';
            this.emitUpdated(data);
            store.dispatch('appSettings/setAppConfig', {
              message: {
                content: this.$t('form.fileUpload.success'),
                type: 'success',
                component: 'dco-snackbar',
                timeOut: 2000,
              },
            });
          } else {
            this.error = true;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

  },
};

export default formFieldsMixin;
