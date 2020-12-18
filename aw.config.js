module.exports = {
  coverage: true,
  mocks: [],
  glob: 'src/**/*.spec.js',
  nyc: {
    reportDir: 'coverage/unit',
  },
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
