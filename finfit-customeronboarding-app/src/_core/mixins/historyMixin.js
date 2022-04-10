/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const historyMixin = {
  data() {
    return {
      execute: true,
    };
  },
  methods: {
    triggerCompare() {
      const storeValue = this.$store.getters['userData/userData'];
      const { oldVal } = storeValue;

      if (oldVal) {
        const newObject = (({
          postalCode, buildingNumber, line1, line2, line3, line4, townOrCity, line5, line7, line6, country,
        }) => ({
          postalCode, buildingNumber, line1, line2, line3, line4, townOrCity, line5, line7, line6, country,
        }))(storeValue);

        const oldObject = (({
          postalCode, buildingNumber, line1, line2, line3, line4, townOrCity, line5, line7, line6, country,
        }) => ({
          postalCode, buildingNumber, line1, line2, line3, line4, townOrCity, line5, line7, line6, country,
        }))(JSON.parse(oldVal));

        if (storeValue.sortcode) {
          const newValue = Object.values(newObject);
          const oldValue = Object.values(oldObject);
          const arraySpread = [...oldValue, ...newValue];
          const compare = arraySpread.every(e => newValue.includes(e));

          if (!compare) {
            this.execute = true;
            const data = { triggerEBAV: true };
            this.handleComponentUpdate(data);
          }
        }
      }
    },
  },
  watch: {
    componentConfig(newVal, oldVal) {
      if (oldVal.store) {
        if (oldVal.store.oldVal) {
          delete oldVal.store.oldVal;
        }
        const data = { oldVal: JSON.stringify(oldVal.store) };
        this.$emit('update', Object.assign({}, { data, state: this.stepperState }));
        setTimeout(() => { this.triggerCompare(); }, 100);
      }
    },
  },
};

export default historyMixin;
