/* eslint-disable import/no-mutable-exports */
/* eslint-disable prefer-destructuring */
import customLogo from '@/themes/custom/images/logo.png';
import defaultLogo from '@/themes/default/images/logo.png';
import Settings from '@/plugins/appSettings';

let colors = '';
let customColors = '';
// eslint-disable-next-line
let mode = process.env.NODE_ENV;
if (mode === 'production') {
  // eslint-disable-next-line
  colors = require('file-loader?name=themes/[name].js!@/themes/default/defaultColorPalette.scss');
  // eslint-disable-next-line
  customColors = require('file-loader?name=customizations/themes/[name].js!@/themes/custom/customColorPalette.scss');
} else {
  // eslint-disable-next-line
  colors = require('@/themes/default/defaultColorPalette.scss');
  // eslint-disable-next-line
  customColors = require('@/themes/custom/customColorPalette.scss');
}

if (mode === 'production') {
  const generateData = function (path) {
    const request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);
    let data = request.response;
    data = data
      .substring(data.indexOf('{'), data.lastIndexOf('}'))
      .replace(/;/gi, ',')
      .concat('}');
    return JSON.parse(data);
  };
  colors = generateData(colors);
  customColors = generateData(customColors);
}
if (mode === 'development') {
  // eslint-disable-next-line
  colors = require('@/themes/default/defaultColorPalette.scss');
  // eslint-disable-next-line
  customColors = require('@/themes/custom/customColorPalette.scss');
}

// eslint-disable-next-line import/no-mutable-exports
let { customGradient } = customColors;
let { defaultGradient } = colors;
let errorColor = '';
let primaryColor = '';
let secondaryColor = '';
let infoColor = '';
let successColor = '';
let warningColor = '';
let customColor = '';
let darkColor = '';
let greyColor = '';
let color = [];
let logo = '';
const gradients = '';
const customLogos = Settings.defaultConfigurations.enableCustomApplicationLogo;
const enableThemes = Settings.defaultConfigurations.enableCustomTheme;
const enableGradient = Settings.defaultConfigurations.enableCustomTheme;
if (enableThemes === true) {
  primaryColor = customColors.primary;
  secondaryColor = customColors.secondary;
  infoColor = customColors.infos;
  errorColor = customColors.errors;
  successColor = customColors.successColor;
  warningColor = customColors.warningColor;
  darkColor = customColors.darkColor;
  greyColor = customColors.greyColor;
} else {
  primaryColor = colors.primary;
  darkColor = colors.darkColor;
  infoColor = colors.infos;
  errorColor = colors.errors;
  successColor = colors.successColor;
  warningColor = colors.warningColor;
  greyColor = colors.greyColor;
  secondaryColor = colors.secondary;
}
if (customLogos === false) logo = defaultLogo;
else logo = customLogo;
// eslint-disable-next-line func-names
const gradient = function () {
  let colorss = 'linear-gradient(45deg';
  for (let i = 0; i < color.length; i += 1) colorss += `,${color[i]}`;
  colorss += ')';
  return colorss;
};
  // eslint-disable-next-line func-names
const grad = function () {
  color = [];
  if (enableGradient === true) {
    // eslint-disable-next-line linebreak-style
    customGradient = customGradient
      .replace(/]/g, '')
      .replace(/\[/g, '')
      .replace(/ /g, '');
    customColor = customGradient.split(',');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < customColor.length; i++) color.push(customColor[i]);
    gradient();
  } else {
    defaultGradient = defaultGradient
      .replace(/]/g, '')
      .replace(/\[/g, '')
      .replace(/ /g, '');
    customColor = defaultGradient.split(',');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < customColor.length; i++) color.push(customColor[i]);
    gradient();
  }
};

export {
  primaryColor,
  secondaryColor,
  infoColor,
  errorColor,
  successColor,
  warningColor,
  gradients,
  colors,
  customColor,
  grad,
  gradient,
  logo,
  darkColor,
  greyColor,
};
