const specFiles = ['src/**/*.spec.js', 'src/**/*.spec.jsx'];

module.exports = {
  glob: specFiles,
  src: [],
  watchGlob: specFiles,
  coverage: true,
  warnings: true,
  mocha: {
    bail: false,
    reporter: 'min',
  },
  mocks: [],
  babel: {
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-react',
      ],
      plugins: ['@babel/plugin-syntax-dynamic-import'],
    },
  },
};
