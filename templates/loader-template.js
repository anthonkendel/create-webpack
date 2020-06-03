const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {},
};

/**
 * @param {string} source
 * @returns {string}
 */
function loader(source) {
  const options = getOptions(this);

  validateOptions(schema, options, { name: 'Loader' });

  return `module.exports = {};`;
}

module.exports = loader;
