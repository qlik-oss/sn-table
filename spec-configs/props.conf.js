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
      GenericObjectProperties: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FGenericObjectProperties',
      },
      NxDimension: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxDimension',
      },
      NxMeasure: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxMeasure',
      },
      HyperCubeDef: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FHyperCubeDef',
      },
      NxHypercubeMode: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxHypercubeMode',
      },
      StringExpression: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas/#%23%2Fdefinitions%2Fschemas%2Fentries%2FStringExpression',
      },
      schemasNxHypercubeMode: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas/#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxHypercubeMode',
      },
      NxAttrExprDef: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxAttrExprDef',
      },
      NxInlineDimensionDef: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineDimensionDef',
      },
      NxInlineMeasureDef: {
        url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineMeasureDef',
      },
    },
  },

  toDts: {
    spec: './api-specifications/properties.json',
    output: {
      file: './types/index.d.ts',
    },
    dependencies: {
      references: ['qlik-engineapi'],
    },
  },
};
