import arg from "arg";
import inquirer from "inquirer";
import fs from "fs";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

/**
 * @param {string[]} args
 * @returns {any} options
 */
function parsArgsIntoOptions(args) {
  const parsedArgs = arg(
    {
      "--help": Boolean,
      "--plugin": Boolean,
      "--loader": Boolean,
      "--js": Boolean,
      "--ts": Boolean,
    },
    { argv: args.slice(2) }
  );

  const options = {
    isPlugin: parsedArgs["--plugin"] || false,
    isLoader: parsedArgs["--loader"] || false,
    isJs: parsedArgs["--js"] || false,
    isTs: parsedArgs["--ts"] || false,
  };

  return options;
}

/**
 * @param {any} options
 * @returns {any} options
 */
async function promptForMissingOptions(options) {
  const questions = [];

  if (
    (options.isLoader && options.isPlugin) ||
    (!options.isLoader && !options.isPlugin)
  ) {
    questions.push({
      type: "list",
      name: "type",
      message: "Please choose one type of Webpack extension:",
      choices: [
        { name: "Loader", value: "loader" },
        { name: "Plugin", value: "plugin" },
      ],
      default: "Loader",
    });
  }

  if ((options.isJs && options.isTs) || (!options.isJs && !options.isTs)) {
    questions.push({
      type: "list",
      name: "language",
      message: "Please choose the language of the Webpack extension:",
      choices: [
        { name: "JavaScript", value: "js" },
        { name: "TypeScript", value: "ts" },
      ],
      default: "js",
    });
  }

  const answers = await inquirer.prompt(questions);

  if (answers.type === "loader") {
    options.isLoader = true;
    options.isPlugin = false;
  } else if (answers.type === "plugin") {
    options.isLoader = false;
    options.isPlugin = true;
  }

  if (answers.language === "js") {
    options.isJs = true;
    options.isTs = false;
  } else if (answers.language === "ts") {
    options.isJs = false;
    options.isTs = true;
  }

  return { ...options };
}

/**
 * @param {string[]} args
 */
export async function cli(args) {
  let options = parsArgsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await writeFile("options.json", JSON.stringify(options, null, 2));
}
