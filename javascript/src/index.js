#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const axios = require("axios");
const { BASE_API } = require("./constants");
const { welcomeMsg: WELCOME } = require("./utils");

/* ---- Welcome Prompt ---- */
console.log(WELCOME);

/* ---- Print result to console ---- */
const printToConsole = async (avHeight, avWeight) => {
  console.log("Average height of queried pokemons: ", avHeight);
  console.log("Average weight of queried pokemons: ", avWeight);
};

/* ---- Get Each Pokemon Details ---- */
const getDetails = async (url) => {
  return await axios.get(url);
};

/* ---- Get Pokemon Data  ---- */
const fetchPokemonDetails = async (l, o) => {
  try {
    let res = await axios.get(`${BASE_API}/?limit=${l}&offset=${o}`); // query list of pokemons
    let promises = [];
    let heights = [];
    let weights = [];

    if (res.status === 200) {
      const { results } = res.data;
      results.forEach((res) => promises.push(getDetails(res.url))); // store all promises

      await Promise.all(promises).then((values) => {
        values.forEach((detail) => {
          heights.push(detail.data.height);
          weights.push(detail.data.weight);
        });
      });

      return [heights, weights];
    }
  } catch (err) {
    return [err, "Something went wrong"];
  }
};

/* ---- Build CLI  ---- */
(async () => {
  await yargs(hideBin(process.argv))
    .command(
      "pokemon <limit> <offset>",
      "get average weight and height of pokemons",
      async (argv) => {
        return argv
          .positional("limit", {
            describe: "url limit",
            type: "string",
            default: 0,
          })
          .positional("offset", {
            describe: "url offset",
            type: "string",
            default: 0,
          });
      },
      async (argv) => {
        const [heights, weights] = await fetchPokemonDetails(
          argv.limit,
          argv.offset
        );
        if (heights && weights) {
          let len = heights.length || weights.length;
          if (len !== 0) {
            const averageHeight =
              heights.reduce((acc, val) => (acc += val), 0) / len;
            const averageWeight =
              weights.reduce((acc, val) => (acc += val), 0) / len;
            printToConsole(averageHeight, averageWeight);
          } else {
            printToConsole(0, 0);
          }
        }
      }
    )
    .parse();
})();
