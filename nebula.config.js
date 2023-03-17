const path = require('path');

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line

const replacementStrings = {
  'process.env.PACKAGE_VERSION': JSON.stringify(version),
};

module.exports = {
  build: {
    typescript: true,
    replacementStrings,
  },
  serve: {
    flags: {
      PS_18291_SN_TABLE_BASIC_FEATURES: true,
    },
    keyboardNavigation: false,
    themes: [
      {
        id: 'sense styling',
        theme: {
          object: {
            straightTableV2: {
              fontSize: '12px',
              color: '#404040',
            },
          },
        },
      },
      {
        id: 'Test',
        theme: {
          straightTableV2: {
            header: {
              fontSize: '40px',
              color: 'chocolate',
              fontFamily: 'sans-serif',
            },
            content: {
              fontSize: '16px',
              color: 'magenta',
              fontFamily: 'sans-serif',
              hover: {
                backgroundColor: 'black',
                color: 'red',
              },
            },
          },
          backgroundColor: '#32a852',
        },
      },
      {
        id: 'Test2',
        theme: {
          straightTableV2: {
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
      {
        id: 'Test3',
        theme: {
          straightTableV2: {
            header: {
              fontSize: '20px',
              color: 'rgba(0,0,0,0.87)',
              fontFamily: 'sans-serif',
            },
            content: {
              fontSize: '16px',
              color: 'rgba(57, 49, 222, 0.87)',
              fontFamily: 'sans-serif',
              hover: {
                backgroundColor: 'rgba(121,222,49,0.7)',
                color: 'rgba(171,205,239,0.5)',
              },
            },
          },
          backgroundColor: 'rgba(200,200,200,0.3)',
        },
      },
    ],
  },
};
