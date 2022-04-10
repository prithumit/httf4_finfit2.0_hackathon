/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import appSettings from './appSettings';
import CommonService from '@/_core/services/commonService';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: appSettings.localizationAndLanguageSettings.appliedLocalizationKey,
  fallbackLocale: appSettings.localizationAndLanguageSettings.defaultLocalizationKey,
  messages: {},
});

export const loadLanguage = lang => CommonService.getLocale(lang)
  .then((response) => {
    i18n.setLocaleMessage(i18n.locale, response[i18n.locale]);
  });
