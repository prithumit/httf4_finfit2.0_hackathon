<template>
  <v-container class="create-credentials">
    <v-card>
      <v-container>
        <div class="text-left">
          <font class="title font-weight-bold">{{
            $t("createCredentials.your_login_credentials")
          }}</font>
        </div>
        <div class="text-left">
          <v-icon :color="secondaryColor" size="20" class="pr-1"
            >mdi-information-outline</v-icon
          >
          <font class="body-2 font-weight-light">{{
            $t("createCredentials.use_emailId_as_username")
          }}</font>
        </div>
        <v-form :value="valid">
          <v-row>
            <v-col cols="12" md="6" sm="12" class="pb-0 pt-8">
              <v-text-field
                v-model="userLoginId"
                label="Login ID"
                @blur="validateLoginId"
                @paste.prevent
                autocomplete="false"
                class="create-credentials__font-size"
                :rules="[rules.loginRequired, rules.loginIdCheck]"
                :color="primaryColor"
                data-qa="userLoginId"
                onCopy="return false"
              >
                <template v-slot:append>
                  &nbsp;
                  <v-progress-circular
                    indeterminate
                    :color="primaryColor"
                    v-if="
                      userLoginId &&
                      userLoginId !== '' &&
                      userLoginId !== null &&
                      isLoginIdAvailable === 2
                    "
                  ></v-progress-circular>
                  <v-icon
                    v-if="
                      userLoginId &&
                      userLoginId !== '' &&
                      userLoginId !== null &&
                      isLoginIdAvailable === 1
                    "
                    color="success"
                    data-qa="login-success"
                    x-medium
                    >mdi-check-circle-outline</v-icon
                  >
                  <v-icon
                    v-if="
                      userLoginId &&
                      userLoginId !== '' &&
                      userLoginId !== null &&
                      isLoginIdAvailable === 0
                    "
                    color="error"
                    data-qa="login-error"
                    x-medium
                    >mdi-close-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="0"></v-col>

            <v-col cols="12" sm="6" class="pb-2 pt-2">
              <v-text-field
                v-model="password"
                @click:append="showPassword = !showPassword"
                @input="comparePassword()"
                :append-icon="
                  password ? (showPassword ? 'mdi-eye' : 'mdi-eye-off') : ''
                "
                :disabled="!isLoginIdValid"
                :rules="[rules.passwordRequired, rules.passwordCheck]"
                :type="showPassword ? 'text' : 'password'"
                :error="mismatched"
                :color="primaryColor"
                :label="$t('createCredentials.enter_password')"
                data-qa="password"
                onCopy="return false"
                class="password create-credentials__font-size"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="pb-4 pt-2">
              <v-text-field
                v-model="confirmPassword"
                @click:append="showConfirmPassword = !showConfirmPassword"
                @input="comparePassword()"
                :disabled="Boolean(password === undefined)"
                :rules="[rules.required, rules.confirmPasswordCheck]"
                :type="showConfirmPassword ? 'text' : 'password'"
                :error="mismatched"
                :error-messages="
                  mismatched ? $t('createCredentials.password_mismatch') : ''
                "
                :color="primaryColor"
                :label="$t('createCredentials.confirm_password')"
                data-qa="confirmPassword"
                class="create-credentials__font-size"
                onCopy="return false"
                name="input"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import '@/_styles/components/createCredentials.scss';
import events from '@/_core/helpers/event';
import CommonService from '@/_core/services/commonService';

export default {
  name: 'dco-customer-create-credentials',
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      mismatched: false,
      password: undefined,
      userLoginId: undefined,
      confirmPassword: undefined,
      valid: true,
      configRegEx: this.$appSettings.defaultConfigurations
        .customerCredentialsValidationRegEx,
      loginRegEx: this.$appSettings.defaultConfigurations
        .customerLoginValidationRegEx,
      validationMessage: this.$appSettings.defaultConfigurations
        .customerCredentialsValidationMessage,
      loginValidationMessage: this.$appSettings.defaultConfigurations
        .customerLoginValidationMessage,
      passwordValidationRule: '',
      loginIdValidationRule: '',
      isLoginIdAvailable: 0,
      rules: {
        passwordRequired: value => !!value || this.$t('createCredentials.required_password'),
        loginRequired: value => !!value || this.$t('createCredentials.required_login'),
        passwordCheck: v => (v && this.validatePassword()) || this.validationMessage,
        loginIdCheck: v => (v && this.validateLoginIdRegex()) || this.loginValidationMessage,
        confirmPasswordCheck: v => (v && this.validateConfirmPassword())
          || this.$t('createCredentials.password_mismatch'),
      },
    };
  },
  watch: {
    userLoginId(val) {
      if (val === null || val === '' || !val) {
        this.confirmPassword = undefined;
        this.password = undefined;
      }
      if (this.isMatched()) {
        this.comparePassword();
      }
    },
  },
  computed: {
    isLoginIdValid() {
      return this.isLoginIdAvailable === 1;
    },
  },
  created() {
    this.passwordValidationRule = new RegExp(this.configRegEx);
    this.loginIdValidationRule = new RegExp(this.loginRegEx);
  },
  methods: {
    async validateLoginId(event) {
      this.isLoginIdAvailable = 2;
      if (
        this.userLoginId
        && this.userLoginId !== ''
        && this.userLoginId !== null
        && this.validateLoginIdRegex()
      ) {
        const { available } = await CommonService.validateLoginId(
          this.userLoginId,
        );

        this.isLoginIdAvailable = Number(available);

        if (!available) {
          this.$store.dispatch('appSettings/setAppConfig', {
            message: {
              content: this.$t('createCredentials.loginid_unavailable'),
              type: 'error',
              component: 'dco-snackbar',
            },
          });
        }
      }
    },
    validateLoginIdRegex() {
      return this.loginIdValidationRule.test(this.userLoginId);
    },
    validatePassword() {
      return this.passwordValidationRule.test(this.password);
    },
    validateConfirmPassword() {
      return this.passwordValidationRule.test(this.confirmPassword);
    },
    isNotEmpty() {
      return this.password && this.confirmPassword;
    },
    isMatched() {
      return this.password === this.confirmPassword;
    },
    comparePassword() {
      this.$emit(
        'update',
        Object.assign(
          {},
          {
            data: {
              applicationStatus: 'SIGNOFF',
            },
          },
        ),
      );
      if (
        this.validatePassword()
        && this.validateConfirmPassword()
        && this.isNotEmpty()
      ) {
        const data = {
          userLoginId: this.userLoginId,
          password: this.password,
          applicationStatus: 'SIGNOFF',
        };
        this.mismatched = !this.isMatched();
        this.$emit('update', { data });
      }

      events.$emit('userInput', {
        credentials:
          this.isMatched()
          && this.validatePassword()
          && this.validateConfirmPassword(),
      });
    },
  },
};
</script>
