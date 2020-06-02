import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import util from 'util';
import path from 'path';
import spawn from 'cross-spawn';

const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

/**
 * @param {string[]} args
 * @returns {any} options
 */
function parsArgsIntoOptions(args) {
  const parsedArgs = arg(
    {
      '--help': Boolean,
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
      message: 'Please choose one type of Webpack extension:',
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

  if (answers.type === 'loader') {
    options.isLoader = true;
    options.isPlugin = false;
  } else if (answers.type === 'plugin') {
    options.isLoader = false;
    options.isPlugin = true;
  }

  if (answers.language === 'js') {
    options.isJs = true;
    options.isTs = false;
  } else if (answers.language === 'ts') {
    options.isJs = false;
    options.isTs = true;
  }

  return { ...options };
}

let i = 4;
/**
 *
 * @param {string} message
 */
function showLoader(ui, message) {
  const loader = ['/', '|', '\\', '-'];
  setInterval(() => {
    ui.updateBottomBar(`${loader[i++ % 4]} ${message}`);
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

/**
 * @param {string[]} args
 */
export async function cli(args) {
  let options = parsArgsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await writeFile('options.json', JSON.stringify(options, null, 2));

  const ui = new inquirer.ui.BottomBar();
  showLoader(ui, 'Installing dependencies...\n');
  const npm = spawn('npm', ['install', '--save', 'webpack', 'webpack-cli', 'schema-utils', 'loader-utils']);

  npm.on('close', async () => {
    showLoader('Setting up files...');

    if (options.isLoader) {
      if (options.isJs) {
        await copyFileFromTemplates('loader-template.js', 'loader.js');
      } else if (options.isTs) {
      }
    }

    if (options.isPlugin) {
      if (options.isJs) {
        await copyFileFromTemplates('plugin-template.js', 'plugin.js');
      } else if (options.isTs) {
      }
    }

    ui.updateBottomBar('Done!');
    process.exit();
  });
}
