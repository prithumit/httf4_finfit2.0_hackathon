const moment = require('moment');
const router = require('@/_core/router');

function validateError(min, max, diff) {
  if (diff <= min && diff >= 0) {
    return `${router.default.app.$t('errors.date.min')} ${min} ${router.default.app.$t('errors.common.years')}`;
  } if (diff >= max) {
    return `${router.default.app.$t('errors.date.max')} ${max} ${router.default.app.$t('errors.common.years')}`;
  } if (diff < 0) {
    return `${router.default.app.$t('errors.date.year')}`;
  }
  return `${router.default.app.$t('errors.date.invalid')}`;
}

function validateDate(v, min, max) {
  const enteredDate = moment(v, 'DD-MM-YYYY');
  const currentDate = moment(new Date());
  const diff = currentDate.diff(enteredDate, 'years');

  /* eslint-disable-next-line */
  if (!isNaN(enteredDate) && enteredDate.length < 2) {
    return false;
  } if (diff >= min && diff <= max) {
    return true;
  }
  return validateError(min, max, diff);
}

module.exports = {
  required: msg => v => !!v || msg,
  minLen: (l, m = l) => v => (v && v.length >= l) || `${router.default.app.$t('errors.common.minimum')} ${m} ${router.default.app.$t('errors.common.characters')}`,
  maxLen: (l, m = l) => v => (v && v.length <= l) || `${router.default.app.$t('errors.common.maximum')} ${m} ${router.default.app.$t('errors.common.characters')}`,
  emailRequired: v => !!v || router.default.app.$t('errors.email.required'),
  // eslint-disable-next-line no-useless-escape
  emailAddress: (v) => {
    if (v)
      return (
        new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(v) || 'Enter a valid email address'
      );
    else return true;
  },
  phoneNumber: v => !!v || router.default.app.$t('errors.phone_number.required'),
  /* eslint-disable-next-line */
  phoneNumberMaxLen: v => new RegExp('^[^0][0-9]{1,20}$').test(v) && !(v && v.length < 10) || router.default.app.$t('errors.phone_characters'),
  dateValidation: (min, max) => v => validateDate(v, min, max),
  pattern: l => v => new RegExp(l).test(v) || `${router.default.app.$t('errors.common.invalid')} ${router.default.app.$t('errors.common.format')}`,
};
