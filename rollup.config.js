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

import fs from 'fs';

function checkInternals() {
  // Checks if the @qlik namespace exists on disk to
  // see if the optional dependecies can be included
  return fs.existsSync('./node_modules/@qlik');
}

export default {
  input: './src/index.js',
  output: {
    file: path.resolve(__dirname, 'dist', 'sn-table.js'),
    name: 'A Table',
    format: 'umd',
    exports: 'default',
    sourcemap: true,
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
      preventAssignment: true,
    }),
    checkInternals()
      ? replace({
          'const __OPIONAL_THEME_DEPS__ = {};': "import { sproutBase } from '@qlik/sprout-theme';",
          delimiters: ['', ''],
          __OPIONAL_THEME_DEPS__: 'sproutBase',
          preventAssignment: true,
        })
      : {},
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
