import type { Arguments, CommandBuilder } from 'yargs';
import axios from 'axios';

const chalk = require("chalk");
const boxen = require("boxen");

const welcome = chalk.white.bold("Welcome to Pokemon CLI");
const style = {
    padding: 1,
    margin: 1,
    borderStyle: "classic",
};
const welcomeMsg = boxen(welcome, style);
console.log(welcomeMsg);


type Options = {
    limit: string;
    offset: string;
};

export const command: string = 'pokemon <limit> <offset>';

let BASE_API = 'https://pokeapi.co/api/v2/pokemon/';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .positional('limit', { type: 'string', demandOption: true })
        .positional('offset', { type: 'string', demandOption: true })

// helper
const getDetails = async (url: string): Promise<number | string> => {
    return await axios.get(url);
};

const printToConsole = (averageHeight: number, averageWeight: number): void => {
    console.log('Average height of queried pokemons: ', averageHeight);
    console.log('Average weight of queried pokemons: ', averageWeight);
};

export const handler = async (argv: Arguments<Options>): Promise<void> => {
    const { limit, offset } = argv;


    // query list of pokemons
    let res = await axios.get(
        `${BASE_API}/?limit=${limit}&offset=${offset}`
    );
    if (res.status === 200) {
        // query details of each pokemon
        let { results } = res.data;
        let promises: any[] = [];

        let pokemonDetails = { heights: [], weights: [] };
        let { heights, weights }: { heights: any[], weights: any[] } = pokemonDetails;

        // store all promises
        results.forEach((res: any) => promises.push(getDetails(res.url)));

        await Promise.all(promises).then(values => {
            values.forEach((detail: any) => {
                heights.push(detail.data.height);
                weights.push(detail.data.weight);
            });

            let len: number = heights.length || weights.length;

            if (len !== 0) {
                const averageHeight: number =
                    heights.reduce((acc, val) => (acc += val), 0) /
                    len;
                const averageWeight: number =
                    weights.reduce((acc, val) => (acc += val), 0) /
                    len;
                printToConsole(averageHeight, averageWeight);
            } else {
                printToConsole(0, 0);
            }
        })
    }
};
