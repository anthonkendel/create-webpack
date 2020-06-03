import { JSONSchema7 } from 'json-schema';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { loader } from 'webpack';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {},
};

function loader(this: loader.LoaderContext, source: string): string {
  const options = getOptions(this) || {};

  validateOptions(schema, options, { name: 'Loader' });

  return `module.exports = {};`;
}

export default loader;
