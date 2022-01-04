const path = require('path');

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line

const replacementStrings = {
  'process.env.PACKAGE_VERSION': JSON.stringify(version),
};

module.exports = {
  build: {
    replacementStrings,
  },
  serve: {
    keyboardNavigation: false,
    themes: [
      {
        id: 'Test',
        theme: {
          straightTable: {
            header: {
              fontSize: '40px',
              color: 'cyan',
            },
            content: {
              fontSize: '16px',
              color: 'magenta',
            },
          },
          backgroundColor: '#000000',
        },
      },
    ],
  },
};
