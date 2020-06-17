# [`new-webpack`](https://github.com/anthonkendel/new-webpack)

A CLI to create new Webpack plugins and loaders

[![latest git version](https://img.shields.io/github/v/tag/anthonkendel/new-webpack?label=version)](https://github.com/anthonkendel/new-webpack)
[![latest npm version](https://img.shields.io/npm/v/new-webpack)](https://www.npmjs.com/package/new-webpack)
[![license](https://img.shields.io/github/license/anthonkendel/new-webpack)](https://github.com/anthonkendel/new-webpack/blob/master/LICENSE)
[![Actions](https://github.com/anthonkendel/new-webpack/workflows/Actions/badge.svg)](https://github.com/anthonkendel/new-webpack/actions)

## Installation

### Requirements

- `node` >= v10
- `npm` >= v5

`new-webpack` can either be installed globally or used with [`npx`](https://www.npmjs.com/package/npx). It's recommended to use `npx` as the CLI is intended to be used once to create a new Webpack plugin or loader.

```bash
npm install --save-dev -g new-webpack
```

```bash
npx new-webpack
```

## Usage

```bash
npx new-webpack <args>
```

The following arguments are available

| argument   | description                                |
| ---------- | ------------------------------------------ |
| `--plugin` | create a new Webpack plugin                |
| `--loader` | create a new Webpack loader                |
| `--js`     | create the Webpack extension in JavaScript |
| `--ts`     | create the Webpack extension in TypeScript |

If the arguments are invalid or missing the CLI will prompt for arguments.

## Example

### Create a Webpack loader in JavaScript

```bash
npx new-webpack --js --loader
```

### Create a Webpack plugin in TypeScript

```bash
npx new-webpack --ts --plugin
```

### Create a Webpack extension in JavaScript but prompt for type of extension

```bash
npx new-webpack --js
```

## Contributing

If you want to contribute and make our project better, your help is very welcome.

## License

[MIT © anthonkendel](https://choosealicense.com/licenses/mit/)
