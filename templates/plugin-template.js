/** @typedef {import("webpack/lib/Compiler")} Compiler */

const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {},
};

class Plugin {
  constructor(options = {}) {
    validateOptions(schema, options, { name: 'Plugin' });
  }

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {}
}

module.exports = Plugin;
