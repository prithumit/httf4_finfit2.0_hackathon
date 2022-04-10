/* eslint-disable */
import moment from 'moment';
import {
  Api,
  Settings,
} from '@/_core/services/api';
import store from '@/_core/store';
import {
  required, minLen, maxLen, dateValidation, pattern,
} from '@/_core/helpers/validationRules';
import handleError from '@/_core/helpers/errorHandler';
import * as colors from '@/_config/_app/utility/themeUtility';

const appDefaults = {
  locale: Settings.localizationAndLanguageSettings.defaultLocalizationKey,
  defaultLocale: Settings.localizationAndLanguageSettings.appliedLocalizationKey,
  targetCountry: Settings.defaultConfigurations.targetCountry,
  countryCode: Settings.defaultConfigurations.countryISDCode,
  dateApiFormat: Settings.defaultConfigurations.dateFormat ? Settings.defaultConfigurations.dateFormat.apiFormat : 'YYYY-MM-DD',
  dateUIFormat: Settings.defaultConfigurations.dateFormat ? Settings.defaultConfigurations.dateFormat.uiFormat : 'DD-MM-YYYY'
};
const queuedActions = [];
let isOnboardActive = false;
let isPasswordActive = false;
let documentType = undefined;

export default {
  getAuthKey() {
    return Api()
      .post('auth/')
      .then(({ token }) => token)
      .catch(e => handleError(e));
  },

  getOtp(otpObj) {
    return Api()
      .post('/service/m/otp', otpObj)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, { 503: false }));
  },

  validateOtp(otpObj) {
    return Api()
      .post('/service/m/validate/', otpObj)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, { 503: false }));
  },

  sendVerificationEmail(email) {
    return Api()
      .post('service/s/sendEmail', {
        email
      })
      .then(({ data }) => data)
      .catch(e => handleError(e, 'EMAIL_ALREADY_VERIFIED', false));
  },

  validateAccountNumber(accountDetails) {
    return Api()
      .post('/EBVA', accountDetails)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  getCountryFromLatLong({ latitude, longitude }) {
    return Api()
      .get(`/getCountry/${latitude}/${longitude}`)
      .then(({ data }) => data.countryCode)
      .catch(e => handleError(e));
  },

  async saveCustomerApplicationData(customerData, actions = undefined) {
    const productCode = this.getProductCode();
    const productType = this.getProductType();
    const productTerm = this.getProductTenure();
    const productTermUnit = this.getProductTenureUnit();
    const assembeledAppData = this.assembleForAppData(customerData);
    const { entityId } = customerData;
    let id;

    try {
      if (entityId) {
        id = await this.updateApplicationData(assembeledAppData);
      } else {

        id = await this.setApplicationData(assembeledAppData);
      }
    } catch (e) {
      console.log(e)
      handleError(e);
    }

    return id;
  },

  setApplicationData(customerData) {
    return Api()
      .post('service/m/application/', customerData)
      .then(({ data }) => data)
      .catch(e => handleError(e, 'CREATE_APPLICATION_FAILURE', true));
  },

  updateApplicationData(customerData) {
    return Api()
      .put('service/s/application/', customerData)
      .then(({ data }) => data)
      .catch(e => { console.log(e); handleError(e, 'CREATE_APPLICATION_FAILURE', false, ['400', '500']) });
  },

  getComponentConfig(componentName) {
    const productType = this.getProductType();

    return Api()
      .post(`api/db/components/${this.assembleForLocale(componentName)}`)
      .then(({ data }) => data[productType])
      .catch(e => handleError(e, false, true));
  },

  async getComponentSchema(componentName, formName, validateState) {
    let componentConfig;

    switch (componentName) {
      case 'Form':
        try {
          componentConfig = await this.getForm(formName, validateState);
        } catch (e) {
          handleError(e);
        }
        break;

      default:
        console.log('not handled');
        break;
    }

    return componentConfig;
  },

  async verifyContact(type, data) {
    let verificationStatus;
    const { mobilePhoneNumber, mobileCountryCode, emailId } = data;

    switch (type) {
      case 'emailId':
        try {
          verificationStatus = await this.verifyEmail(emailId);
        } catch (e) {
          handleError(e);
        }
        break;

      case 'mobilePhoneNumber':
        try {
          verificationStatus = await this.verifyPhone({ mobilePhoneNumber, mobileCountryCode });
        } catch (e) {
          handleError(e);
        }
        break;

      default:
        console.log('not handled');
        break;
    }

    return verificationStatus;
  },

  verifyEmail(email) {
    return Api()
      .get(`service/m/verifyEmail?emailId=${email}`)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, true));
  },

  validateLoginId(loginID) {
    return Api()
      .get(`service/m/verifyLogin?userLoginId=${loginID}`)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, true));
  },

  verifyEmailStatus(email) {
    return Api()
      .get(`service/m/emailStatus/${email}`)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, true));
  },

  verifyPhone(phoneObj) {
    return Api()
      .post('service/m/verifyPhone', phoneObj)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, true));
  },

  verifyUserStatus(phoneObj) {
    return Api()
      .post('service/m/verifyStatus', phoneObj)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, true));
  },

  async getForm(formName, validateState) {
    let dForm;
    let cForm;

    try {
      dForm = (await this.getFormConfig(formName, validateState))
        || (await this.getFormConfig(formName, validateState, true));
      cForm = (await this.getCustomFormConfig(formName, validateState))
        || (await this.getCustomFormConfig(formName, validateState, true));
    } catch (e) {
      handleError(e);
    }

    return {
      title: { ...dForm.title, ...cForm.title },
      schema: { ...dForm.schema, ...cForm.schema },
      model: { ...dForm.model, ...cForm.model },
    };
  },

  getFormConfig(formName, validateState, overRideLocale = false) {
    const localeExt = this.assembleForLocale(formName, overRideLocale);

    return Api()
      .post(`api/db/forms/${localeExt}`)
      .then(({ data }) => {
        const { schema } = data;
        let ruleState;
        let colorPalette;
        if (typeof schema === 'object') {
          ruleState = validateState ? this.getFormRules(data) : this.removeFormRules(data);
          colorPalette = this.getFormColors(ruleState);
        }

        return colorPalette;
      })
      .catch(e => handleError(e));
  },

  getCustomFormConfig(formName, validateState, overRideLocale = false) {
    const localeExt = this.assembleForLocale(formName, overRideLocale);

    return Api()
      .post(`api/db/custom/${localeExt}`)
      .then(({ data }) => {
        const { schema } = data;
        let ruleState;
        let colorPalette;
        if (typeof schema === 'object') {
          ruleState = validateState ? this.getFormRules(data) : this.removeFormRules(data);
          colorPalette = this.getFormColors(ruleState);
        }

        return colorPalette;
      })
      .catch(e => handleError(e));
  },

  assembleForLocale(formPrefix, overRideLocale = false) {
    const { locale } = store.getters['appSettings/config'] || appDefaults;
    const localeExt = !overRideLocale ? locale : appDefaults.defaultLocale;

    return `${formPrefix}-${localeExt}`;
  },

  removeFormRules({ model, schema }) {
    const fSchema = schema;

    Object.keys(fSchema).map((schemaKey) => {
      const rules = [];

      fSchema[schemaKey].rules = rules;
      return true;
    });

    return {
      schema: fSchema,
      model,
    };
  },

  getRules(rule, RegEx, length, displayLength) {
    switch (rule) {
      case 'required':
        return required('Required');
      case 'minLen':
        return minLen(length, displayLength);
      case 'maxLen':
        return maxLen(length, displayLength);
      case 'dateValidation':
        return dateValidation(length, displayLength);
      case 'pattern':
        return pattern(RegEx);
      default:
        break;
    }

    return null;
  },

  getFormRules({ model, schema }) {
    const validationRules = ['required', 'minLen', 'maxLen', 'dateValidation'];
    const fSchema = schema;

    Object.keys(fSchema).map(async (schemaKey) => {
      const rules = [];
      const ruleSet = fSchema[schemaKey].rules;

      if (fSchema[schemaKey]['data-api-key'] && !fSchema[schemaKey].items) {
        const ddItems = await this.getDropdownObj(fSchema[schemaKey]['data-api-key']);

        fSchema[schemaKey].items = ddItems;
      }

      if (ruleSet) {
        // eslint-disable-next-line no-return-assign
        ruleSet.filter(rule => (rule === 'required' ? (fSchema[schemaKey].id = 'required') : false));
        ruleSet.filter(rule => (validationRules.includes(rule.replace(/[^a-zA-Z]+/g, ''))
          ? rules.push(
            this.getRules(
              rule.replace(/[^a-zA-Z]+/g, ''),
              rule.replace(/[a-zA-Z()]+/g, ''),
              rule.substring(
                rule.lastIndexOf('(') + 1,
                rule.lastIndexOf(','),
              ),
              rule.substring(
                rule.lastIndexOf(')'),
                rule.lastIndexOf(',') + 1,
              ),
            ),
          )
          : false));
      }

      fSchema[schemaKey].rules = rules;
      return true;
    });
    return {
      schema: fSchema,
      model,
    };
  },

  getFormColors({ model, schema }) {
    const fSchema = schema;

    Object.keys(fSchema).map((schemaKey) => {
      const { color } = fSchema[schemaKey];
      fSchema[schemaKey].color = colors[color];
      return true;
    });
    return {
      schema: fSchema,
      model,
    };
  },

  getProductType() {
    return (store.getters['appSettings/config'].productType || Settings.defaultConfigurations.defaultProductType);
  },

  getProductCode() {
    return store.getters['appSettings/config'].productCode || undefined;
  },

  getProductTenure() {
    return store.getters['appSettings/config'].productTermStripped || undefined;
  },

  getProductTenureUnit() {
    return store.getters['appSettings/config'].termUnit || undefined;
  },

  assembleForAppData(customerData) {
    try {
      const { version = 1 } = store.getters['userData/userData'];
      const { entityId, appConsent, accountVerifiedFlag = false } = customerData;
      const productTenureUnits = {
        M: "MONTH",
        D: "DAY",
        Y: "YEAR"
      };
      const { PersonalDetails, AddressDetails, NominatedAccountDetails, TaxDetails, statusInformation, productInformation } = customerData;
      if (PersonalDetails) {
        delete PersonalDetails.undefined;
        delete PersonalDetails.nationalIdDocument;
      }
      if (NominatedAccountDetails) {
        delete NominatedAccountDetails.undefined;
        delete NominatedAccountDetails.accountProof;
      }
      const { interestRateId = 0, currencyCode = "GBP" } = productInformation;
      const productObj = {
        productTypeCode: this.getProductType(),
        productId: this.getProductCode(),
        accountOwnership: "SOLE",
        modeOfOperation: "SOLE",
        tenorFrequency: productTenureUnits[this.getProductTenureUnit()],
        tenorValue: this.getProductTenure(),
        interestRate: interestRateId,
        postingRestriction: "NONE",
        currencyCode,
        maturityInstruction: "NO-INSTRUCTION",
        currencyCode: "GBP"
      };
      const personalObj = {
        residentCountryCode: "GBR",
        residentCountryId: "GBR",
        gender: "003",
        dateOfBirth: (moment(moment(customerData.dateOfBirth, appDefaults.dateApiFormat, true)).isValid()) ? customerData.dateOfBirth : (customerData.dateOfBirth ? moment(customerData.dateOfBirth, appDefaults.dateUIFormat).format(appDefaults.dateApiFormat) : '')
      };
      const appData = {
        documentInformation: null,
        taxInformation: TaxDetails ? (!new Set(Object.values(TaxDetails)).has("")) ? JSON.stringify(TaxDetails) : null : null,
        accountInformation: NominatedAccountDetails ? (new Set(Object.values(NominatedAccountDetails)).size > 1) ? JSON.stringify(Object.assign(NominatedAccountDetails, { accountVerifiedFlag })) : null : null,
        personalInformation: PersonalDetails ? (!new Set(Object.values(PersonalDetails)).has("")) ? JSON.stringify(Object.assign(PersonalDetails, personalObj)) : null : null,
        contactInformation: AddressDetails ? (new Set(Object.values(AddressDetails)).size > 3) ? JSON.stringify(Object.assign(AddressDetails, { postalCode: AddressDetails.postalCode.replace(/\s/g, '') })) : null : null,
        statusInformation: appConsent ? JSON.stringify(appConsent) : null,
        productInformation: JSON.stringify(productObj),
        applicationId: "2E5A20E6-1A23-42CD-8826-89459DBCBAD1",
        mobileCountryCode: customerData.phoneCountryCode,
        mobilePhoneNumber: customerData.phoneNumber,
        emailId: customerData.emailAddress,
        activeFrom: customerData.activeFrom,
        activeTill: customerData.activeTill,
        applicationStatus: "S",
        activeFlag: "Y",
        systemFlag: "N",
        readOnlyFlag: "N",
        deletedFlag: "N",
        entityId,
        version
      };

      return appData;

    } catch (e) {
      console.log(e)
    }
  },

  getDropdownObj(dropdownType) {
    return Api()
      .get(`/service/m/${dropdownType}`)
      .then(({ data }) => data)
      .catch(e => handleError(e))
  },

  getAddress(postalCode) {
    return Api()
      .get(`service/m/search/${postalCode}`)
      .then(({ data }) => Object.assign(data, { country: appDefaults.targetCountry }))
      .catch(e => handleError(e));
  },

  getLocale(localeCode) {
    return Api()
      .get(`locale/${localeCode}`)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  getProductDetails() {
    const productCode = this.getProductCode();
    const productType = this.getProductType()
    const productTenure = this.getProductTenure();
    const productTermUnit = this.getProductTenureUnit();
    const productUrl = (productTenure) ? `${productType}/${productCode}/?productTerm=${productTenure}${productTermUnit}` : `${productType}/${productCode}`;

    if (productCode) {
      return Api()
        .get(`/service/m/product/${productUrl}`)
        .then(({ data }) => {
          Object.assign(data, { Tenure: productTenure });
          return data;
        })
        .catch(e => handleError(e, 'PRODUCT_FAILURE', true));
    }
    return true;
  },

  createPassword(passwordData) {
    const { mobilePhoneNumber, mobileCountryCode, entityId, emailId } = this.assembleForAppData(passwordData);
    const { userLoginId, password } = passwordData;
    const passwordPayload = {
      entityId,
      emailId,
      mobileCountryCode,
      mobilePhoneNumber,
      userLoginId,
      password,
    };

    return Api()
      .post('service/m/credentials/', passwordPayload)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },


  getProspectApp(entityId) {
    return Api()
      .get(`service/s/application/${entityId}`)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, { 503: false }));
  },

  verifyExternalAccount(customerData, type = 'SORTCODE') {
    const { sortCode, accountNumber } = customerData;
    if (!sortCode && !accountNumber) {
      return;
    }
    const appData = this.assembleForAppData(customerData);
    const customerDetails = {
      contactInformationDTO: JSON.parse(appData.contactInformation),
      personalInformationDTO: JSON.parse(appData.personalInformation)
    };

    return Api()
      .post(`service/m/ebav?accountNumber=${accountNumber}&sortCode=${sortCode}`, customerDetails)
      .then(({ data }) => {
        const returnObj = {};
        Object.assign(returnObj, { data, customerDetails })
        return returnObj
      })
      .catch(e => handleError(e, 'EXTERNAL_EBAV_VERIFICATION', false, ['401']));
  },

  createProspect(prospectData) {
    const { email, number } = prospectData;
    const prospectPayload = {
      email,
      name: '',
      phoneNumber: {
        number,
        type: 'MOBILE',
      },
    };

    return Api()
      .post('service/s/createProspect', prospectPayload)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, { 503: false }));
  },

  verifyCustomer(customerData) {
    const { email, number } = customerData;
    const customerPayload = {
      identificationNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: number,
      emailAddress: email,
    };

    return Api()
      .post('service/public/verifyCustomer', customerPayload)
      .then(({ data }) => data)
      .catch(e => handleError(e, false, { 503: false }));
  },

  verifyProspect(prospectData) {
    const { emailAddress, phoneNumber } = prospectData;

    return Api()
      .post('/personal-customers/verify', {
        data: {
          email: emailAddress,
          phoneNumber: {
            type: 'MOBILE',
            number: phoneNumber,
          },
        },
      })
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  async verifyAndCreateCustomer(type, customerData) {
    let result;
    const managedActions = ['ONBOARD_PROSPECT'];
    const errorNotFound = {
      message: 'This action is not handled',
      status: '404',
    };

    // if (managedActions.includes(type) && !queuedActions.includes(type)) {
    //   queuedActions.push(type);
    //   return;
    // }
    switch (type) {
      case 'CREATE_PROSPECT':
        try {
          result = await this.createProspect(customerData);
        } catch (e) {
          handleError(e);
        }
        return result;

      case 'CREATE_PASSWORD':
        if (isPasswordActive) {
          return;
        }
        try {
          result = await this.createPassword(customerData);

          if (result) {
            isPasswordActive = true;
          }
        } catch (e) {
          isPasswordActive = false;
          handleError(e);
        }
        return result;

      case 'VERIFY_CUSTOMER':
        try {
          result = await this.verifyCustomer(customerData);
        } catch (e) {
          handleError(e);
        }
        return result;

      case 'CREATE_APPLICATION':
        if (isOnboardActive) {
          return;
        }
        try {
          result = await this.saveCustomerApplicationData(customerData, queuedActions);
        } catch (e) {
          handleError(e);
        }
        return result;

      case 'ONBOARD_PROSPECT':
        if (isOnboardActive) {
          return;
        }
        try {
          result = await this.onboardProspect(customerData);

          if (result) {
            isOnboardActive = true;
          }
        } catch (e) {
          handleError(e);
        }
        return result;

      default:
        handleError(errorNotFound);
        break;
    }

    return true;
  },

  onboardProspect(customerData) {
    return Api()
      .post('service/m/onboard', this.assembleForAppData(customerData))
      .then(({ data }) => data)
      .catch(e => handleError(e, 'ONBOARD_PROSPECT_FAILURE', true));
  },

  getCountryCodes() {
    return Api()
      .get(`service/m/country/`)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  getFile(entityId, documentCategoryCode) {
    // if (documentType !== documentCategoryCode) {
    // documentType = documentCategoryCode;
    return Api()
      .get(`service/m/upload/${entityId}/${documentCategoryCode}`)
      .then(({ data }) => data)
      .catch(e => handleError(e, 'GET_FILE', false, ['404']));
    // }
  },

  documentUpload(formObject) {
    return Api()
      .post('service/m/upload/', formObject)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  ammendParty(documentInfo, storeData) {
    const { partyId, country } = storeData;
    const customerInfo = {
      partyID: partyId,
      basicDetails: {
        documentDetails: [
          {
            documentCategory: 'Account Proof',
            documentType: 'Bank Statement',
            documentReference: 'Account Proof',
            documentIssueAuthority: '',
            countryOfIssue: country,
            isDocumentVerified: true,
            validToDate: '',
            validFromDate: '',
            imageId: documentInfo.documentID,
          },
        ],
      },
    };

    return Api()
      .put('service/public/ammendParty', customerInfo)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  revokeToken() {
    return Api()
      .post('service/revoke/', {})
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },

  abortApplication(customerData) {
    const { entityId } = customerData;

    return Api()
      .delete(`service/s/abort/${entityId}`)
      .then(({ data }) => data)
      .catch(e => handleError(e));
  },
};
