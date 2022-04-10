// eslint-disable-next-line
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify, {
  VSelect, VTextField, VDatePicker, VCalendar, VCheckbox, VFlex, VAutocomplete, VFileInput
} from 'vuetify/lib';
import Touch from 'vuetify/es5/directives/touch';
import Resize from 'vuetify/es5/directives/resize';

Vue.use(Vuetify, {
  components: {
    VSelect, VTextField, VDatePicker, VCalendar, VCheckbox, VFlex, VAutocomplete, VFileInput
  },
  directives: {
    Touch,
    Resize,
  },
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});
