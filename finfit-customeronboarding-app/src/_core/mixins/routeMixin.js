const routeMixin = {
  methods: {
    routeToHome(home = true) {
      const {
        productCode, productType, termUnit, productTerm = "",
      } = this.$store.getters['appSettings/config'];

      if (productType && productCode) {
        // eslint-disable-next-line no-restricted-globals
        const setProductTerm = isNaN(productTerm) ? productTerm : `${productTerm}${termUnit}`;

        if (!home) {
          let redirectUrl = `/onboard/${productType}/${productCode}/`;
          redirectUrl = setProductTerm ? `/onboard/${productType}/${productCode}/${setProductTerm}` : redirectUrl;
          this.$router.push(redirectUrl);
        } else {
          const dcoURl = setProductTerm ? `/dco/${productType}/${productCode}/${setProductTerm}` : `/dco/${productType}/${productCode}/`;

          this.$router.push(dcoURl);
        }
      } else {
        this.$router.push(`/dco/${productType}`);
        if (home) {
          this.resetHome();
        }
      }
    },
  },
};

export default routeMixin;
