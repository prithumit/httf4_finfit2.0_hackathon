import * as Settings from '@/_config/_app/appConfiguration-en.json';

const rulesMixin = {
  methods: {
    verifyInput(formInput) {
      const { rules } = Settings.default;

      // eslint-disable-next-line no-prototype-builtins
      const m = Object.keys(formInput).filter(k => rules.hasOwnProperty(k));

      m.forEach((key) => {
        const regx = new RegExp(rules[key]);
      });
    },
  },
};

export default rulesMixin;
