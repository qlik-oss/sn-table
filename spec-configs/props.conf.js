const fs = require('fs');
const path = require('path');

const pkg = require(path.resolve(__dirname, '../package.json')); // eslint-disable-line

module.exports = {
  glob: ['./src/object-properties.js'],
  package: path.resolve(__dirname, '../package.json'),
  api: {
    stability: 'experimental',
    properties: {
      'x-qlik-visibility': 'public',
    },
    visibility: 'public',
    name: `${pkg.name}:properties`,
    version: pkg.version,
    description: 'Table generic object definition',
  },
  output: {
    file: path.resolve(__dirname, '../api-specifications/properties.json'),
  },
  parse: {
    types: {
      'qae.GenericObjectProperties': {
        url: 'https://core.qlik.com/services/qix-engine/apis/qix/definitions/#genericobjectproperties',
      },
      'qae.NxDimension': {
        url: 'https://core.qlik.com/services/qix-engine/apis/qix/definitions/#nxdimension',
      },
      'qae.NxMeasure': {
        url: 'https://core.qlik.com/services/qix-engine/apis/qix/definitions/#nxmeasure',
      },
      'qae.HyperCubeDef': {
        url: 'https://core.qlik.com/services/qix-engine/apis/qix/definitions/#hypercubedef',
      },
    },
  },
};
