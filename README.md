[![CircleCI](https://circleci.com/gh/qlik-oss/sn-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/maintainability)](https://codeclimate.com/github/qlik-oss/sn-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-table/test_coverage)

# sn-table

table supernova for [nebula.js](https://qlik.dev/libraries-and-tools/nebulajs)

## Installing

If you use npm: `npm install @nebula.js/sn-table`

## Mashup Usage

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

Look into [Build a simple mashup using nebula.js](https://qlik.dev/tutorials/build-a-simple-mashup-using-nebulajs) to learn more

## Visualization Extensions Usage

### Steps to create a sn-table extension as as a Qlik Sense extension

Install all dependencies:

```sh
yarn
```

Build nebula.js visualization

```sh
yarn build
```

Build a nebula visualization as a Qlik Sense extension

```sh
yarn sense
```

| [Saas Edition of Qlik Sense](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm) | [Qlik Sense Enterprise](https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm) | [Qlik Sense Desktop](https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm) |
| --------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------: |
| copy sn-table-ext into https://your-tenant.us.qlikcloud.com/console/extensions/                                                   |                                             copy sn-table-ext into Qlik Management Console (QMC)->Extensions                                             |                                                                            copy sn-table-ext into ..\Users\<UserName>\Documents\Qlik\Sense\Extensions |
