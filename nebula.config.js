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
              padding: '10px',
            },
            content: {
              fontSize: '16px',
              color: 'magenta',
              padding: '10px',
            },
          },
          backgroundColor: '#32a852',
        },
      },
    ],
  },
};
