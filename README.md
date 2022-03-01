[![CircleCI](https://circleci.com/gh/qlik-oss/sn-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/maintainability)](https://codeclimate.com/github/qlik-oss/sn-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-table/test_coverage)

# sn-table

table supernova for [nebula.js]

## Mashup Usage

### Installing

If you use npm:

`npm install @nebula.js/sn-table`

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

Look into [Build a simple mashup using nebula.js](https://qlik.dev/tutorials/build-a-simple-mashup-using-nebulajs) to learn more.

[See full example](./mashup-example) of the mashup usage.

More specifics and information about the sn-table can be found in [the Qlik developer portal](https://qlik.dev/libraries-and-tools/visualizations/table).

## Visualization Extension Usage

### Steps to create a sn-table extension as as a Qlik Sense extension

Install all dependencies:

```sh
yarn
```

Build nebula.js visualization:

```sh
yarn build
```

Build a nebula visualization as a Qlik Sense extension:

```sh
yarn sense
```

|                          [Saas Edition of Qlik Sense]                           |                     [Qlik Sense Enterprise]                      |                            [Qlik Sense Desktop]                            |
| :-----------------------------------------------------------------------------: | :--------------------------------------------------------------: | :------------------------------------------------------------------------: |
| Copy sn-table-ext into https://your-tenant.us.qlikcloud.com/console/extensions/ | Copy sn-table-ext into Qlik Management Console (QMC)->Extensions | Copy sn-table-ext into ..\Users\<UserName>\Documents\Qlik\Sense\Extensions |

### Test extension against the Saas Edition of Qlik Sense

1. Adding your webIntegrationId in nebula.config.js as shown below:

```
module.exports = {
  serve: {
    webIntegrationId: 'your_web_intergration_id'
  },
};
```

You can learn how to get webIntegrationId (qlik-web-integration-id) from [here](https://qlik.dev/tutorials/build-a-simple-mashup-using-nebulajs#set-up-a-qlik-sense-saas-account).

2. Install with `yarn`
3. Transpile code with `yarn build` (or `yarn build:watch`)
4. Run it using nebula dev environment with `yarn start`
5. Pointing the engine url to your tenant: wss://tenant.us.qlik-stage.com (Note: http://localhost:8000 should be added to the whitelist of origins).

## API

The API can also be found in [the Qlik developer portal](https://qlik.dev/apis/javascript/nebula-table)

## Contribution

Follow the instructions in our [contributing guide](./.github/CONTRIBUTION.md).

## Package

| name       | status                             | description                   |
| ---------- | ---------------------------------- | ----------------------------- |
| [sn-table] | [![sn-table-status]][sn-table-npm] | table supernova for nebula.js |

## License

`@nebula.js/sn-table` is [MIT licensed](./LICENSE).

[nebula.js]: https://qlik.dev/libraries-and-tools/nebulajs
[sn-table]: https://github.com/qlik-oss/sn-table
[sn-table-status]: https://img.shields.io/npm/v/@nebula.js/sn-table.svg
[sn-table-npm]: https://www.npmjs.com/package/@nebula.js/sn-table
[saas edition of qlik sense]: https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm
[qlik sense enterprise]: https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm
[qlik sense desktop]: https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm
