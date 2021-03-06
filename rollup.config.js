import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import visualizer from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

import jsxPlugin from '@babel/plugin-transform-react-jsx';
import classProps from '@babel/plugin-proposal-class-properties';
import chaining from '@babel/plugin-proposal-optional-chaining';

const pkg = require(path.resolve(process.cwd(), 'package.json')); // eslint-disable-line  import/no-dynamic-require
const { name, version, license, author } = pkg;

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
    file: path.resolve(__dirname, 'dist', 'sn-table.js'),
    name: moduleName,
    format: 'umd',
    exports: 'default',
    sourcemap: false,
    globals: {
      '@nebula.js/stardust': 'stardust',
    },
  },
  external: ['@nebula.js/stardust'],
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
    terser({
      output: {
        preamble: banner,
      },
    }),
  ],
};
