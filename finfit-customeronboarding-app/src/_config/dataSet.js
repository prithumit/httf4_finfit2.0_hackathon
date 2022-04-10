const requireDir = require('require-dir');

const forms = requireDir('_features/forms/');
const components = requireDir('_features/components/');
const custom = requireDir('_features/custom/');

module.exports = () => ({
  forms,
  components,
  custom,
});
