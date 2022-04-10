import store from '@/_core/store';
import router from '@/_core/router';

let errorStatus = '';
let enableRedirect = false;

const redirectToHome = () => {
  const { productCode, productType, productTerm } = router.app.$route.params;
  const { refer } = router.app.$route.meta;

  if (productType) {
    router.push(`/${productType}/${productCode}/${productTerm}`);
  } else {
    router.push(`/${refer}`);
  }
};

const processRedirect = (redirectObj, errStatus) => {
  let redirectStatus = false;

  if (redirectObj && redirectObj.hasOwnProperty(errStatus)) {
    redirectStatus = redirectObj[errStatus];
  } else if (redirectObj) {
    redirectStatus = true;
  }

  return redirectStatus;
};

const redirectOnError = () => {
  const statusCodes = ['401', '404', '400', '500'];
  const exceptionCodes = ['503'];

  switch (true) {
    case (statusCodes.includes(errorStatus)):
      if (statusCodes.includes(errorStatus) && processRedirect(enableRedirect, errorStatus)) {
        redirectToHome();
      }
      break;

    case (exceptionCodes.includes(errorStatus)):
      if (exceptionCodes.includes(errorStatus) && processRedirect(enableRedirect, errorStatus)) {
        redirectToHome();
      }
      break;

    case (errorStatus === '405'):
      // eslint-disable-next-line
      break;

    default:
      // eslint-disable-next-line
      location.reload();
      break;
  }
};

const assembleMessage = (message, title) => {
  const messageArray = [];
  messageArray.push(message);

  store.dispatch('appSettings/setAppConfig', {
    message: {
      content: message,
      type: 'error',
      component: 'dco-modal',
      title,
      cancelCallback: redirectOnError,
      close: true,
      persistent: true,
    },
  });
};

const setExceptionError = (type = 'DEFAULT') => {
  assembleMessage(router.app.$t(`systemMessages.exceptions.${type}.message`), router.app.$t(`systemMessages.exceptions.${type}.title`));
};

const handleError = (e, type = undefined, redirect = undefined, hideError = []) => {
  const { status, data } = e.response || e;

  store.dispatch('appSettings/setAppConfig', {
    inProgress: false,
  });

  if (status && data) {
    const { title, detail, causes, error } = data

    errorStatus = status.toString();
    enableRedirect = redirect;
    if (type) {
      if (hideError.length && Array.isArray(hideError)) {
        if (hideError.includes(errorStatus)) {
          return;
        }
      }
      setExceptionError(type);
      return;
    }
    router.app.$log.debug('Service Error  -', data.message);
    const errorMsgBody = `systemMessages.${status}.${(error) ? `custom.${error.replace(/[^a-z0-9,.]/gi, '')}` : 'message'}`;
    assembleMessage(causes[0].message ? `${causes[0].message}` : errorMsgBody, router.app.$t(`systemMessages.${status}.title`));
  } else if (!status) {
    if ((e.toString().indexOf('Network Error')) !== -1) {
      assembleMessage(router.app.$t('systemMessages.exceptions.NETWORK_ERROR.message'), router.app.$t('systemMessages.exceptions.NETWORK_ERROR.title'));
    }
  }
};

export default handleError;
