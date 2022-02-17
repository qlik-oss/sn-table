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
      {
        id: 'Test2',
        theme: {
          straightTable: {
            header: {
              fontSize: '20px',
              color: 'blue',
              padding: '40px',
            },
            content: {
              fontSize: '16px',
              color: '232323',
              padding: '40px',
            },
          },
          backgroundColor: 'cyan',
        },
      },
    ],
  },
};
