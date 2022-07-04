#! /usr/bin/env node
/* eslint-disable no-console */

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const build = require('@nebula.js/cli-build');
const sense = require('@nebula.js/cli-sense');
const snTablePackage = require('../package.json');
const rnSnTablePackage = require('../react-native/package.json');

const args = yargs(process.argv.slice(2)).argv;
const buildExt = args.ext;
const buildCore = args.core;
const mode = args.mode || 'production';
const watch = args.w;
const sourcemap = mode !== 'production';
const { reactNative } = args;

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

if (reactNative) {
  buildArgs.reactNative = true;
}

// this function will sync packages.
const configureReactNative = () => {
  // cleanup old build
  const reactNativeFolder = './react-native';
  fs.removeSync(path.resolve(process.cwd(), `${reactNativeFolder}/dist`));
  const nextVersion = rnSnTablePackage.version.split('.');
  const minor = parseInt(nextVersion[nextVersion.length - 1], 10) + 1;
  nextVersion[nextVersion.length - 1] = minor;
  rnSnTablePackage.version = nextVersion.join('.');
  rnSnTablePackage.peerDependencies = { ...rnSnTablePackage.peerDependencies, ...snTablePackage.peerDependencies };
  fs.writeFileSync(
    path.resolve(process.cwd(), `${reactNativeFolder}/package.json`),
    JSON.stringify(rnSnTablePackage, null, 2)
  );
};

const main = async () => {
  console.log('---> BUILDING SUPERNOVA');

  const watcher = await build(buildArgs);
  if (buildExt) {
    buildExtension();
    if (watch) {
      watcher.on('event', (event) => {
        event.code === 'BUNDLE_END' && buildExtension();
      });
    }
  }

  if (reactNative) {
    configureReactNative();
    await build(buildArgs);
  }
};

main();
