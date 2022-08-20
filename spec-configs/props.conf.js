const path = require('path');

const pkg = require(path.resolve(__dirname, '../package.json')); // eslint-disable-line

module.exports = {
  fromJsdoc: {
    glob: ['./src/qae/object-properties.js'],
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
        'EngineAPI.IGenericObjectProperties': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FGenericObjectProperties',
        },
        'EngineAPI.INxDimension': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxDimension',
        },
        'EngineAPI.INxMeasure': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxMeasure',
        },
        'EngineAPI.IHyperCubeDef': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FHyperCubeDef',
        },
        'EngineAPI.INxHypercubeMode': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxHypercubeMode',
        },
        'EngineAPI.IStringExpression': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas/#%23%2Fdefinitions%2Fschemas%2Fentries%2FStringExpression',
        },
        'EngineAPI.INxAttrExprDef': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxAttrExprDef',
        },
        'EngineAPI.INxInlineDimensionDef': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineDimensionDef',
        },
        'EngineAPI.INxInlineMeasureDef': {
          url: 'https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineMeasureDef',
        },
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
