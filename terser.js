#!/usr/bin/env node

/**
 * Minifies a file with existing sourcemap with terser.
 *
 * arg1 {string} file to minify
 * arg2 {string} output file
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const terser = require('terser');
const moment = require('moment');
const commenting = require('commenting');
const version = require("./package.json").version;

assert(process.argv.length >= 4, "./terser <input> <output> <preamble>");

const inFilename = process.argv[2];
const outFilename = process.argv[3];

const preamble =
`react-msa-viewer ${version}
Copyright ${ moment().format('YYYY') }, Plotly, Inc.
All rights reserved.
Licensed under the MIT license.
Generated: ${ moment().format('YYYY-MM-DD') }
Version: ${version}
Source: https://github.com/plotly/react-msa-viewer`;

const options = {
    compress: {
        passes: 2
    },
    mangle: true,
    sourceMap: {
        content: fs.readFileSync(inFilename + ".map", "utf8"),
        url: path.basename(outFilename) + ".map",
    },
    output: {
        beautify: false,
        preamble: commenting(preamble.trim(), {extension: ".js"}),
    }
};
console.log(`./terser ${inFilename} -> ${outFilename}`);
const code = fs.readFileSync(inFilename, 'utf8');
const result = terser.minify(code, options);
fs.writeFileSync(outFilename, result.code, 'utf8');
fs.writeFileSync(outFilename + ".map", result.map, 'utf8');
