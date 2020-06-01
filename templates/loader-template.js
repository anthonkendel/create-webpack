const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {},
};

/**
 * @param {string} source
 */
export default function (source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Loader');

  return `module.exports = {};`;
}
