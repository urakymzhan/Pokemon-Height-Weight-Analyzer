#!/usr/bin/env node

/**
 * pokemon
 * Determine the average weight and height of a given subset of Pokemon.
 *
 * @author Alan (Ulan) Rakymzhan <https://www.ulan13.me>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const {
	welcomeMsg: WELCOME,
	getDetails,
	printToConsole
} = require('./utils/helpers');
const { BASE_API } = require('./utils/constant');
const inquirer = require('inquirer');
const axios = require('axios').default;

/* ---- create-node-cli setup ---- */
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

/* ---- Build CLI  ---- */
const go = (async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	/* ---- Welcome Prompt ---- */
	console.log(WELCOME);

	let pokemonDetails = { heights: [], weights: [] };
	let { heights, weights } = pokemonDetails;

	if (input.includes('pokemon')) {
		inquirer
			.prompt([
				{ type: 'string', message: 'Enter limit: ', name: 'limit' },
				{ type: 'string', message: 'Enter offset: ', name: 'offset' }
			])
			.then(async ans => {
				const { limit, offset } = ans;

				let res = await axios.get(
					`${BASE_API}/?limit=${limit}&offset=${offset}` // query list of pokemons
				);
				if (res.status === 200) {
					let { results } = res.data; // query details of each pokemon
					let promises = [];

					results.forEach(res => promises.push(getDetails(res.url))); // store all promises

					Promise.all(promises).then(values => {
						values.forEach(detail => {
							heights.push(detail.data.height);
							weights.push(detail.data.weight);
						});

						let len = heights.length || weights.length;

						if (len !== 0) {
							const averageHeight =
								heights.reduce((acc, val) => (acc += val), 0) /
								len;
							const averageWeight =
								weights.reduce((acc, val) => (acc += val), 0) /
								len;
							printToConsole(averageHeight, averageWeight);
						} else {
							printToConsole(0, 0); // default vals
						}
					});
				} else {
					throw new Error();
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	debug && log(flags);
})();
