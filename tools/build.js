#! /usr/bin/env node
/* eslint-disable no-console */

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const build = require('@nebula.js/cli-build');

const args = yargs(process.argv.slice(2)).argv;
const buildCore = args.core;
const mode = args.mode || 'production';
const watch = args.w;

// cleanup old build
fs.removeSync(path.resolve(process.cwd(), 'dist'));
fs.removeSync(path.resolve(process.cwd(), 'core/esm'));

const buildArgs = {};
if (buildCore) {
  buildArgs.core = 'core';
}

if (mode === 'production') {
  buildArgs.mode = 'production';
  buildArgs.sourcemap = false;
}

if (watch) {
  buildArgs.watch = true;
}

const main = async () => {
  console.log('---> BUILDING SUPERNOVA');
  build(buildArgs);
};

main();
