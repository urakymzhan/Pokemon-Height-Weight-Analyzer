#!/usr/bin/env node

// shebang character sequence “converts” the JavaScript file 
// into a Node.js command-line script.

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    // Use the commands directory to scaffold.
    .commandDir('commands')
    // Enable strict mode.
    .strict()
    // Useful aliases.
    .alias({ h: 'help' })
    .argv;
