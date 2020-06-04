import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import util from 'util';
import path from 'path';
import spawn from 'cross-spawn';

const copyFile = util.promisify(fs.copyFile);
const ui = new inquirer.ui.BottomBar();

/**
 * @param {string[]} args
 * @returns {any} options
 */
function parsArgsIntoOptions(args) {
  const parsedArgs = arg(
    {
      '--plugin': Boolean,
      '--loader': Boolean,
      '--js': Boolean,
      '--ts': Boolean,
    },
    { argv: args.slice(2) }
  );

  const options = {
    isPlugin: parsedArgs['--plugin'] || false,
    isLoader: parsedArgs['--loader'] || false,
    isJs: parsedArgs['--js'] || false,
    isTs: parsedArgs['--ts'] || false,
  };

  return options;
}

/**
 * @param {any} options
 * @returns {any} options
 */
async function promptForMissingOptions(options) {
  const questions = [];

  if ((options.isLoader && options.isPlugin) || (!options.isLoader && !options.isPlugin)) {
    questions.push({
      type: 'list',
      name: 'type',
      message: 'Please choose the Webpack extension to create:',
      choices: [
        { name: 'Loader', value: 'loader' },
        { name: 'Plugin', value: 'plugin' },
      ],
      default: 'Loader',
    });
  }

  if ((options.isJs && options.isTs) || (!options.isJs && !options.isTs)) {
    questions.push({
      type: 'list',
      name: 'language',
      message: 'Please choose the language of the Webpack extension:',
      choices: [
        { name: 'JavaScript', value: 'js' },
        { name: 'TypeScript', value: 'ts' },
      ],
      default: 'js',
    });
  }

  const answers = await inquirer.prompt(questions);

  const optionsFromAnswers = { ...options };
  optionsFromAnswers.isLoader = options.isLoader || answers.type === 'loader';
  optionsFromAnswers.isPlugin = options.isPlugin || answers.type === 'plugin';
  optionsFromAnswers.isJs = options.isJs || answers.language === 'js';
  optionsFromAnswers.isTs = options.isTs || answers.language === 'ts';

  return { ...options, ...optionsFromAnswers };
}

let loaderIndex = 4;
/**
 * @param {string} message
 */
function showLoader(message) {
  const loader = ['/', '|', '\\', '-'];
  setInterval(() => {
    ui.updateBottomBar(`${loader[loaderIndex++ % 4]} ${message}`);
  }, 400);
}

/**
 * @param {string} templateFileName
 * @param {string} outputFileName
 */
async function copyFileFromTemplates(templateFileName, outputFileName) {
  const source = path.resolve(__dirname, '..', `templates/${templateFileName}`);
  const destination = `${process.cwd()}/${outputFileName}`;

  await copyFile(source, destination);
}

async function onCloseNpmInstall(options) {
  showLoader('Setting up files...\n');

  if (options.isLoader) {
    if (options.isJs) {
      await copyFileFromTemplates('loader-template.js', 'loader.js');
    } else if (options.isTs) {
      await copyFileFromTemplates('loader-template.ts', 'loader.ts');
    }
  }

  if (options.isPlugin) {
    if (options.isJs) {
      await copyFileFromTemplates('plugin-template.js', 'plugin.js');
    } else if (options.isTs) {
      await copyFileFromTemplates('plugin-template.ts', 'plugin.ts');
    }
  }

  ui.updateBottomBar('Done!\n');
  process.exit();
}

function onErrorNpmInstall() {
  ui.updateBottomBar('Something went wrong...\nExiting!\n');
  process.exit(-1);
}

/**
 * @param {string[]} args
 */
export async function cli(args) {
  let options = parsArgsIntoOptions(args);
  options = await promptForMissingOptions(options);

  showLoader('Installing dependencies...\n');

  const dependenciesToInstall = ['loader-utils', 'schema-utils', 'webpack', 'webpack-cli'];
  if (options.isTs) {
    dependenciesToInstall.push('@types/loader-utils');
    dependenciesToInstall.push('@types/schema-utils');
    dependenciesToInstall.push('@types/webpack');
  }
  const npm = spawn('npm', ['install', '--save-dev', ...dependenciesToInstall]);

  npm.on('close', () => onCloseNpmInstall(options));
  npm.on('error', onErrorNpmInstall);
}
