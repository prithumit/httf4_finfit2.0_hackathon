import {
  infoColor,
  logo,
  grad,
  errorColor,
  colors,
  successColor,
  warningColor,
  gradient,
  gradients,
  customColor,
  primaryColor,
  secondaryColor,
  darkColor,
  greyColor,
} from '@/_config/_app/utility/themeUtility';

const colorMixin = {
  data() {
    return {
      infoColor,
      logo,
      grad,
      errorColor,
      colors,
      successColor,
      warningColor,
      gradient,
      gradients,
      customColor,
      primaryColor,
      secondaryColor,
      darkColor,
      greyColor,
    };
  },
  created() {
    grad();
    this.gradients = gradient();
  },
};


export default colorMixin;
