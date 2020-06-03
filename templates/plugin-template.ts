import { JSONSchema7 } from 'json-schema';
import { Compiler } from 'webpack';
import validateOptions from 'schema-utils';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {},
};

class Plugin {
  constructor(options = {}) {
    validateOptions(schema, options, { name: 'Plugin' });
  }

  apply(compiler: Compiler) {}
}

export default Plugin;
