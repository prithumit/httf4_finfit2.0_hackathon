import * as Settings from '@/_config/_app/appConfiguration-en.json';
import { loadLanguage } from '@/plugins/vueI18n';

const localeMixin = {
  mounted() {
    this.$i18n.locale = this.loadLocaleParam();
    loadLanguage(this.$i18n.locale);
  },
  methods: {
    loadLocaleParam() {
      return this.$store.getters['appSettings/config'].locale || Settings.localizationAndLanguageSettings.appliedLocalizationKey;
    },
  },
};

export default localeMixin;
