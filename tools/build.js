#! /usr/bin/env node
/* eslint-disable no-console */

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const build = require('@nebula.js/cli-build');
<<<<<<< HEAD
const sense = require('@nebula.js/cli-sense');
=======
const snTablePackage = require('../package.json');
const rnSnTablePackage = require('../react-native/package.json');
>>>>>>> 99938dc (fix: sync versions)

const args = yargs(process.argv.slice(2)).argv;
const buildExt = args.ext;
const buildCore = args.core;
const mode = args.mode || 'production';
const watch = args.w;
const sourcemap = mode !== 'production';
const { carbon } = args;

// cleanup old build
fs.removeSync(path.resolve(process.cwd(), 'dist'));
fs.removeSync(path.resolve(process.cwd(), 'core/esm'));

const buildArgs = {};

const buildExtension = async () => {
  console.log('---> BUILDING EXTENSION');
  await sense({ output: 'sn-table-ext', sourcemap });
};

if (buildCore) {
  buildArgs.core = 'core';
}

if (mode === 'production') {
  buildArgs.sourcemap = false;
} else {
  buildArgs.mode = mode;
}

if (watch) {
  buildArgs.watch = true;
}

if (carbon) {
  buildArgs.reactNative = true;
}

const configureReactNative = () => {
  // cleanup old build
  const reactNativeFolder = './react-native';
  fs.removeSync(path.resolve(process.cwd(), `${reactNativeFolder}/dist`));
  rnSnTablePackage.version = snTablePackage.version;
  fs.writeFileSync(`${reactNativeFolder}/package.json`, JSON.stringify(rnSnTablePackage, null, 2));
  console.log(snTablePackage);
};

const main = async () => {
  console.log('---> BUILDING SUPERNOVA');
  const watcher = await build(buildArgs);
  if (buildExt) {
    buildExtension();
    if (watch) {
      watcher.on('event', (event) => {
        if (event.code === 'BUNDLE_END') {
          buildExtension();
        }
      });
    }
  }
  if (carbon) {
    configureReactNative();
  }
  build(buildArgs);
};

main();
