[![CircleCI](https://circleci.com/gh/qlik-oss/sn-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/maintainability)](https://codeclimate.com/github/qlik-oss/sn-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-table/test_coverage)

# sn-table

table supernova for nebula.js

## Installing

If you use npm: `npm install @nebula.js/sn-table`

## Usage

```js
import { embed } from '@nebula.js/stardust';
import table from '@nebula.js/sn-table';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [{ // register the table object
    name: 'table',
    load: () => Promise.resolve(table);
  }]
});

nuked.render({
  element,
  type: 'table',
});
```

[See full example](./mashup-example) of the mashup usage

More specifics and information about the sn-table can be found in [the Qlik developer portal](https://qlik.dev/libraries-and-tools/visualizations/table)

## API

The API can also be found in [the Qlik developer portal](https://qlik.dev/apis/javascript/nebula-table)
