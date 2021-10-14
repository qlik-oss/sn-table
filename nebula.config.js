const path = require('path');

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line

const replacementStrings = {
  'process.env.PACKAGE_VERSION': JSON.stringify(version),
};

module.exports = {
  build: {
    replacementStrings,
  },
};
