const chalk = require('chalk');
const boxen = require('boxen');
const axios = require('axios').default;
const { green } = require('chalk');

/* ---- Welcome Prompt ---- */
const welcome = chalk.white.bold('Welcome to Pokemon CLI');
const style = {
	padding: 1,
	borderStyle: 'classic'
};
const welcomeMsg = boxen(welcome, style);

/* ---- Get Each Pokemon Details ---- */
const getDetails = url => {
	return axios.get(url);
};

/* ---- Print result to console ---- */
const printToConsole = (avHeight, avWeight) => {
	console.log(green('Average height of queried pokemons: '), avHeight);
	console.log(green('Average weight of queried pokemons: '), avWeight);

	return [avHeight, avWeight];
};

module.exports = { welcomeMsg, getDetails, printToConsole };
