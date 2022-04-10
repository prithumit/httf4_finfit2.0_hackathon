/* eslint-disable no-restricted-globals */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/_core/store';
import Home from '@/pages/Home/Home.vue';
import Settings from '@/plugins/appSettings';
import { loadLanguage } from '@/plugins/vueI18n';

Vue.use(Router);

const appDefaults = {
  locale: Settings.localizationAndLanguageSettings.appliedLocalizationKey,
};

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:productType?/:productCode?/:productTerm?',
      name: 'dco',
      component: Home,
      meta: {
        requiresAuth: false,
        refer: 'dco',
      },
    },
    {
      path: '/onboard/:productType/:productCode/:productTerm?',
      name: 'onboard',
      component: () => import('@/pages/Onboard/Onboard.vue'),
      meta: {
        requiresAuth: true,
        refer: 'dco',
      },
    },
    {
      path: '/confirmOnboard/:productType/:productCode/:productTerm?',
      name: 'confirmOnboard',
      component: () => import('@/pages/OnboardConfirmationScreen/OnboardConfirmationScreen.vue'),
      meta: {
        requiresAuth: false,
        refer: 'dco',
      },
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

/* eslint-disable consistent-return */
router.beforeEach((to, from, next) => {
  // loadLanguage('en').then(() => next());
  const {
    productCode, productType, productTerm,
  } = (!store.getters['appSettings/config'].productType) ? to.params : store.getters['appSettings/config'];
  const { locale } = to.params.locale || appDefaults;
  const { requiresAuth, refer } = to.meta;
  const { isAuthorized, entityId } = store.getters['userData/userData'];
  const { accessToken } = store.getters['appSettings/config'];
  const productTermUnit = (productTerm && isNaN(productTerm)) ? productTerm.split(parseInt(productTerm, 10))[1] : 'M';

  store.dispatch('appSettings/setAppConfig', {
    locale,
    productCode,
    productType,
    productTerm,
    productTermStripped: parseInt(productTerm, 10),
    termUnit: productTermUnit,
  });

  if (requiresAuth) {
    if (isAuthorized) {
      next();
    } else if (productType) {
      const redirectUrl = productTerm ? `/${refer}/${productType}/${productCode}/${productTerm}` : `/${refer}/${productType}/${productCode}`;

      next(redirectUrl);
      return false;
    } else {
      next(`/${refer}/`);
      return false;
    }
  }

  if (to.name === 'dco') {
    store.dispatch('userData/removeUserData');
    if (entityId) {
      store.dispatch('appSettings/setAppConfig', { expireSession: true });
      setTimeout(() => {
        store.dispatch('appSettings/removeAppConfig');
        // eslint-disable-next-line
        location.reload();
      }, 2000);
    }
  }

  store.dispatch('appSettings/setAppConfig', { expireSession: false });

  next();
});

export default router;
