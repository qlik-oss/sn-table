const path = require('path');

const pkg = require(path.resolve(__dirname, '../package.json')); // eslint-disable-line

module.exports = {
  fromJsdoc: {
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
      // license: /* string */,
    },
    output: {
      sort: {
        alpha: true, // set to true to sort entries and definitions alphabetically
      },
      diffOnly: false, // set to true to write to file only when API has changed
      file: path.resolve(__dirname, '../api-specifications/properties.json'),
    },
    spec: {
      validate: true, // set to false to skip validation against schema, set to 'diff' to validate only when API has changed
    },
    // jsdoc: /* object */, // jsdoc configuration object
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
      rules: {
        'no-unknown-types': 1,
        'no-missing-types': 1,
        'no-multi-return': 1,
        'no-unknown-stability': 2,
        'no-duplicate-references': 1,
        'no-untreated-kinds': 1,
        'no-default-exports-wo-name': 1,
        'no-unknown-promise': 1,
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
