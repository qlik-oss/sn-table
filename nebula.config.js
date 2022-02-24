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
              color: 'chocolate',
              fontFamily: 'sans-serif',
            },
            content: {
              fontSize: '16px',
              color: 'magenta',
              fontFamily: 'sans-serif',
            },
          },
          backgroundColor: '#32a852',
        },
      },
      {
        id: 'Test2',
        theme: {
          straightTable: {
            header: {
              fontSize: '20px',
              color: 'blue',
              fontFamily: 'sans-serif',
            },
            content: {
              fontSize: '16px',
              color: '#232323',
              fontFamily: 'sans-serif',
            },
          },
          backgroundColor: 'cyan',
        },
      },
    ],
  },
};
