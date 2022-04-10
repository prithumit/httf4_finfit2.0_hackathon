/* eslint-disable import/named */
import Vuetify from 'vuetify';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import appSettings from '@/plugins/appSettings';
import { i18n } from '@/plugins/vueI18n';
import Home from '@/pages/Home/Home.vue';
import router from '@/_core/router/';
import store from '@/_core/store';
import appData from '@/_config/_app/appConfiguration-en.json';
import CommonService from '@/_core/services/commonService';

fdescribe('Home page', () => {
  const localVue = createLocalVue();
  const prospectAppData = {
    accountinformationData: {
      selectedProductDetails: {
        productContextCode: '04010DEFAULTGBP',
        productTerm: 3,
        termUnit: 'M',
      },
    },
    applicationData: "{customerDetails: { title: '', firstName: 'Vishwa', lastName: 'N', dateOfBirth: '1970-02-18',gender: '003', countryOfResidency: 'GBR', kycCheckRequired: 'CORE-DEFINED', addresses: [{addressType: 'HM'}],applicationId: '547'}}",
  };
  let wrapper;

  localVue.use({
    Vuex,
    Vuetify,
  });
  localVue.use(appSettings);
  beforeEach(() => {
    jest.runAllTimers();
    jest.useFakeTimers();
    CommonService.getCountryFromLatLong = jest.fn().mockReturnValue('IN');
    CommonService.abortApplication = jest.fn().mockReturnValue({ status: 'FAILURE' });
    CommonService.getProspectApp = jest.fn('PTY0001').mockReturnValue(prospectAppData);
    CommonService.verifyAndCreateCustomer = jest
      .fn('CREATE_PROSPECT', {
        dateOfBirth: '',
        emailAddress: 'vi@h.com',
        firstName: '',
        identificationNumber: '',
        lastName: '',
        phoneNumber: '0044 12345 67890',
      })
      .mockReturnValue({ status: 'NOT_FOUND' });
    CommonService.verifyEmail = jest.fn('abc@gmail.com').mockReturnValue({
      expiryDate: '2020-06-23T11:31:00.700Z',
      message: 'E-mail verification link sent to email',
      status: 'success',
    });

    wrapper = mount(Home, {
      localVue,
      store,
      data() {
        return {
          disableLandingPageDialog: true,
          enableTargetCountryAlert: true,
          userObj: {
            customerType: 'EXIST',
            status: 'NOT_FOUND',
          },
        };
      },
      mocks: {
        $appSettings: appSettings,
        $i18n: () => {},
        $router: () => {
          jest.fn();
        },
      },
      router,
      i18n,
      appSettings,
    });
    wrapper.setData({
      appData,
      home: {
        phoneNumber: '7911 123456',
        emailAddress: 'abc@gmail.com',
        setUKResident: true,
        setOTPSection: false,
        termsAndConditionDialog: false,
      },
      otp: {
        isValid: false,
        hash: '',
        maxLength: 6,
      },
      termsAndConditionsModel: {
        model: false,
      },
    });

    wrapper.vm.isValidLength = jest.fn().mockReturnValue(true);
  });

  it('is mounted', () => {
    expect(wrapper.is(Home)).toBe(true);
  });

  it('should call sendEmailVerification()', () => {
    CommonService.verifyAndCreateCustomer = jest
      .fn('VERIFY_CUSTOMER', {
        dateOfBirth: '',
        emailAddress: 'sample@h.com',
        firstName: '',
        identificationNumber: '',
        lastName: '',
        phoneNumber: '0044 12345 67890',
      })
      .mockReturnValue({ status: 'NOT_FOUND' });
    wrapper.vm.sendEmailVerification();
  });

  it('should call getProspectApplication()', () => {
    wrapper.vm.getProspectApplication();
  });

  it('to fetch OTP', () => {
    wrapper.vm.fetchOTP();
    expect(wrapper.vm.home.setOTPSection).toBe(true);
  });

  it('throws undefined when no OTP is entered', () => {
    wrapper.vm.validateOTP();
    expect(wrapper.vm.home.isValidOTP).toBe(undefined);
  });

  it('to validate correct OTP', () => {
    CommonService.validateOtp = jest.fn().mockReturnValue(Promise.resolve({ status: true }));
    wrapper.vm.otp.hash = '123456';
    wrapper.vm.validateOTP();
    expect(wrapper.vm.otp.isValid).toBe(false);
  });

  it('to show invalid OTP', () => {
    wrapper.vm.proceedToNext();
    wrapper.vm.abortApplication();
    CommonService.getOtp = jest.fn().mockReturnValue(Promise.resolve('123456'));
    CommonService.validateOtp = jest.fn().mockReturnValue(Promise.resolve(false));
    wrapper.vm.fetchOTP('resend');
    wrapper.vm.otp.hash = '123456';
    wrapper.vm.validateOTP();
    expect(wrapper.vm.otp.isValid).toBe(false);
  });

  it('to open terms and condition', () => {
    wrapper.vm.openTermsAndCondition();
    expect(wrapper.vm.termsAndConditionsModel.enabled).toBe(true);
  });

  it('to close terms and condition', () => {
    wrapper.vm.agreeToTermsAndCondition();
    expect(wrapper.vm.termsAndConditionsModel.enabled).toBe(false);
  });

  it('redirects on non-existing customer', () => {
    const spy = jest.spyOn(wrapper.vm.$router, 'push');

    wrapper.vm.home.phoneNumber = '9863312212';
    wrapper.vm.home.emailAddress = 'nonexist@gmail.com';
    wrapper.vm.home.setUKResident = true;
    wrapper.vm.home.setOTPSection = true;
    wrapper.vm.home.agreeTermsFlag = true;
    wrapper.vm.otp.isValid = true;

    wrapper.find('.agree-tos').trigger('click');
  });

  it('triggers OTP generation onClick', () => {
    wrapper.vm.home.setUKResident = true;
    wrapper.vm.home.setOTPSection = false;
    wrapper.vm.home.phoneNumber = '9863312212';
    const phoneInput = wrapper.find('.phone-number-input');

    wrapper.vm.getOTP();
    phoneInput.trigger('keydown.enter');
    phoneInput.element.value = '9863312212';
    phoneInput.trigger('input');

    expect(wrapper.vm.home.setOTPSection).toBe(true);
  });

  it('call handleUser() on getting started with new user', () => {
    const spy = jest.fn();
    CommonService.verifyUserStatus = jest.fn({
      mobilePhoneNumber: '567884345678',
      mobileCountryCode: '91',
    }).mockReturnValue({
      userStatus: null,
      entityId: undefined
    });
    CommonService.verifyEmailStatus = jest.fn('test@mail.com').mockReturnValue(true);
    wrapper.vm.home.phoneNumber = '9863312212';
    wrapper.vm.home.countryISDCode = '91';
    wrapper.vm.home.emailAddress = 'nonexist@gmail.com';
    wrapper.vm.home.setUKResident = true;
    wrapper.vm.home.setOTPSection = true;
    wrapper.vm.home.agreeTermsFlag = true;
    wrapper.vm.otp.isValid = true;
    wrapper.vm.isTOSMandatory = true;
    wrapper.vm.isTOSDisabled = jest.fn().mockReturnValue(true);
    wrapper.find('.agree-tos').trigger('click');

    wrapper.vm.isValidated = false;

    wrapper.vm.handleUser = jest.fn().mockReturnValue(true);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('call handleUser() on getting started with customer', () => {
    const spy = jest.fn();
    CommonService.verifyUserStatus = jest.fn({
      mobilePhoneNumber: '567884345678',
      mobileCountryCode: '91',
    }).mockReturnValue({
      userStatus: 'Customer',
      entityId: undefined
    });
    CommonService.verifyEmailStatus = jest.fn('test@mail.com').mockReturnValue(true);
    wrapper.vm.home.phoneNumber = '9863312212';
    wrapper.vm.home.countryISDCode = '91';
    wrapper.vm.home.emailAddress = 'nonexist@gmail.com';
    wrapper.vm.home.setUKResident = true;
    wrapper.vm.home.setOTPSection = true;
    wrapper.vm.home.agreeTermsFlag = true;
    wrapper.vm.otp.isValid = true;
    wrapper.vm.isTOSMandatory = true;
    wrapper.vm.isTOSDisabled = jest.fn().mockReturnValue(true);
    wrapper.find('.agree-tos').trigger('click');

    wrapper.vm.isValidated = false;

    wrapper.vm.handleUser = jest.fn().mockReturnValue(true);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('call handleUser() on getting started with Prospect', () => {
    const spy = jest.fn();
    CommonService.verifyUserStatus = jest.fn({
      mobilePhoneNumber: '567884345678',
      mobileCountryCode: '91',
    }).mockReturnValue({
      userStatus: 'Prospect',
      entityId: undefined
    });
    CommonService.verifyEmailStatus = jest.fn('test@mail.com').mockReturnValue(true);
    CommonService.getProspectApp = jest.fn('1234567').mockReturnValue({});
    CommonService.getFile = jest.fn('123434567', 'FECO_PROOF_CATEGORY_PHOTO').mockReturnValue({
      documentType: 'test',
      documentData: 'test',
      documentName: 'test'
    });
    wrapper.vm.home.phoneNumber = '9863312212';
    wrapper.vm.home.countryISDCode = '91';
    wrapper.vm.home.emailAddress = 'nonexist@gmail.com';
    wrapper.vm.home.setUKResident = true;
    wrapper.vm.home.setOTPSection = true;
    wrapper.vm.home.agreeTermsFlag = true;
    wrapper.vm.otp.isValid = true;
    wrapper.vm.isTOSMandatory = true;
    wrapper.vm.isTOSDisabled = jest.fn().mockReturnValue(true);
    wrapper.find('.agree-tos').trigger('click');

    wrapper.vm.isValidated = false;

    wrapper.vm.handleUser = jest.fn().mockReturnValue(true);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
