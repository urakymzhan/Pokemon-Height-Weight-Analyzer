const chalk = require("chalk");
const boxen = require("boxen");

/* ---- Welcome Prompt ---- */
const welcome = chalk.white.bold("Welcome to Pokemon CLI");
const style = {
  padding: 1,
  borderStyle: "classic",
};
const welcomeMsg = boxen(welcome, style);

module.exports = { welcomeMsg };
