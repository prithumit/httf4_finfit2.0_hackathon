const requireDir = require('require-dir');

const forms = requireDir(`${process.env.DATA_DIR}/_config/_features/forms/`);
const components = requireDir(`${process.env.DATA_DIR}/_config/_features/components/`);
const custom = requireDir(`${process.env.DATA_DIR}/_config/_features/custom/`);
const locale = requireDir(`${process.env.DATA_DIR}/_config/_locale/`);

module.exports = () => ({
  forms,
  components,
  custom,
  locale,
});
