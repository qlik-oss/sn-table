import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import visualizer from 'rollup-plugin-visualizer';
import path from 'path';

import jsxPlugin from '@babel/plugin-transform-react-jsx';
import classProps from '@babel/plugin-proposal-class-properties';
import chaining from '@babel/plugin-proposal-optional-chaining';

// get metadata from regular package.json
const { name, version, license, author } = require(path.resolve(process.cwd(), 'package.json')); // eslint-disable-line  import/no-dynamic-require
const pkg = require(path.resolve(process.cwd(), 'core/package.json')); // eslint-disable-line  import/no-dynamic-require

const auth = typeof author === 'object' ? `${author.name} <${author.email}>` : author || '';
const moduleName = name.split('/').reverse()[0];

const banner = `/*
* ${name} v${version}
* Copyright (c) ${new Date().getFullYear()} ${auth}
* Released under the ${license} license.
*/
`;

export default {
  input: './src/index.js',
  output: {
    banner,
    file: path.resolve(__dirname, 'core', pkg.module),
    name: moduleName,
    format: 'esm',
    exports: 'default',
    sourcemap: true,
    globals: {
      '@nebula.js/stardust': 'stardust',
    },
  },
  external: ['@nebula.js/stardust', 'react', 'react-dom'],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
      preventAssignment: true,
    }),
    external(),
    postcss(),
    babel({
      babelrc: false,
      include: ['src/**'],
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              browsers: ['last 2 Chrome versions'],
            },
          },
        ],
        ['@babel/react'],
      ],
      plugins: [[jsxPlugin], [classProps], [chaining]],
    }),
    commonjs(),
    image(),
    visualizer(),
  ],
};
