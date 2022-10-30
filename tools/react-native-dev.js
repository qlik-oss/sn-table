const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const fsPackage = require('../package.json');
const rnSnTablePackage = require('../react-native/package.json');

const buildDir = path.resolve(process.cwd(), 'build');
const srcDir = path.resolve(process.cwd(), 'src');
const args = yargs(process.argv.slice(2)).argv;
const { log } = console;

const configureReactNative = () => {
  // cleanup old build
  const dst = `${buildDir}/dist`;
  // fs.removeSync(path.resolve(process.cwd(), `${reactNativeFolder}/dist`));
  const nextVersion = rnSnTablePackage.version.split('.');
  const minor = parseInt(nextVersion[nextVersion.length - 1], 10) + 1;
  nextVersion[nextVersion.length - 1] = minor;
  fsPackage.version = nextVersion.join('.');
  delete fsPackage.files;
  fs.writeFileSync(`${buildDir}/package.json`, JSON.stringify(fsPackage, null, 2));
  fs.writeFileSync(`react-native/package.json`, JSON.stringify(fsPackage, null, 2));
  fs.removeSync(`${dst}/__test__`);
};

function main() {
  log('Running with ', args);

  const dst = `${buildDir}/dist`;
  fsPackage.name = '@nebula.js/react-native-sn-table';
  fsPackage.files = ['dist'];
  fsPackage.main = 'index.js';

  delete fsPackage.scripts;
  delete fsPackage.devDependencies;
  delete fsPackage['lint-staged'];
  delete fsPackage.dependencies;
  delete fsPackage.husky;

  // cleanup old build
  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);
  fs.mkdirSync(dst);
  fs.cpSync(srcDir, dst, { recursive: true });
  configureReactNative();
  fs.writeFileSync(`${dst}/package.json`, JSON.stringify(fsPackage, null, 2));

  if (args.w) {
    log('Watching...');
    const dstDir = 'react-native-dev/TableApp/node_modules/@nebula.js/react-native-sn-table';

    fs.watch(srcDir, { recursive: true }, (e, f) => {
      const dstFile = `${dstDir}/${f}`;
      const srcFile = `${srcDir}/${f}`;
      log(`${f} - ${e}`);
      fs.cpSync(srcFile, dstFile);
    });
  }
}

main();
