"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const axios_1 = __importDefault(require("axios"));
const chalk = require("chalk");
const boxen = require("boxen");
const welcome = chalk.white.bold("Welcome to Pokemon CLI");
const style = {
    padding: 1,
    margin: 1,
    borderStyle: "classic",
};
const welcomeMsg = boxen(welcome, style);
// console.log(welcomeMsg);
process.stdout.write(welcomeMsg);
exports.command = 'pokemon <limit> <offset>';
exports.desc = 'Greet <name> with Hello';
let BASE_API = 'https://pokeapi.co/api/v2/pokemon/';
const builder = (yargs) => yargs
    .positional('limit', { type: 'string', demandOption: true })
    .positional('offset', { type: 'string', demandOption: true });
exports.builder = builder;
// helper
const getDetails = async (url) => {
    return await axios_1.default.get(url);
};
const printToConsole = (averageHeight, averageWeight) => {
    console.log('Average height of queried pokemons: ', averageHeight);
    console.log('Average weight of queried pokemons: ', averageWeight);
};
const handler = async (argv) => {
    const { limit, offset } = argv;
    // query list of pokemons
    let res = await axios_1.default.get(`${BASE_API}/?limit=${limit}&offset=${offset}`);
    if (res.status === 200) {
        // query details of each pokemon
        let { results } = res.data;
        let promises = [];
        let pokemonDetails = { heights: [], weights: [] };
        let { heights, weights } = pokemonDetails;
        // store all promises
        results.forEach((res) => promises.push(getDetails(res.url)));
        Promise.all(promises).then(values => {
            values.forEach((detail) => {
                heights.push(detail.data.height);
                weights.push(detail.data.weight);
            });
            let len = heights.length || weights.length;
            if (len !== 0) {
                const averageHeight = heights.reduce((acc, val) => (acc += val), 0) /
                    len;
                const averageWeight = weights.reduce((acc, val) => (acc += val), 0) /
                    len;
                printToConsole(averageHeight, averageWeight);
            }
            else {
                printToConsole(0, 0);
            }
        });
    }
};
exports.handler = handler;
// const greeting = `Hello, ${name}!`;
// process.stdout.write(upper ? greeting.toUpperCase() : greeting);
// process.exit(0);
// };
