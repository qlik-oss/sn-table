> **Warning** This repository is now archived and will not be updated

> This repository was originally published to foster collaboration and engagement with developers as they customized or developed visualizations, but due to customer feedback and usage data, it is now moved back to closed source. Moving this and other projects back to closed source will support better integration with internal build and test tooling, and free up resources for investment in these and other visualizations.

[![CircleCI](https://circleci.com/gh/qlik-oss/sn-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/maintainability)](https://codeclimate.com/github/qlik-oss/sn-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-table/test_coverage)

# sn-table

Table supernova for [nebula.js]

More specifics and information about the sn-table can be found in [the Qlik developer portal](https://qlik.dev/libraries-and-tools/visualizations/table).

## Contribution

Information about developing and contributing can be found in our [contribution guide](./.github/CONTRIBUTION.md).

## Mashup Usage

### Installing

If you use npm:

`npm install @nebula.js/sn-table`

Or without a build tool, You can also load the sn-table through the script tag from [unpkg](https://unpkg.com/@nebula.js/sn-table).

```html
<script src="https://unpkg.com/@nebula.js/sn-table"></script>
```

### Usage

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

### Tutorial & Examples

Look into [Build a simple mashup using nebula.js](https://qlik.dev/tutorials/build-a-simple-mashup-using-nebulajs) and [Embed a visualization](https://qlik.dev/libraries-and-tools/nebulajs/rendering) to learn more.

Check full [examples](./mashup-example) of mashup usage for sn-table.

## Visualization Extension Usage

### Building and adding the sn-table extension to Qlik Sense

NOTE: at this point sn-table uses a package that require internal Qlik access. This means that external users cannot run `pnpm install` to install.
The package in question will soon be public and thus enable all users to install and build.
Until then, external users can revert to using version 1.21.0, which is the last version that works for everyone.

Install all dependencies:

```sh
pnpm install
```

Build a nebula.js visualization as a Qlik Sense extension:

```sh
pnpm build
```

Compress the generated 'sn-table-ext' folder into the 'application/zip' file format

|                          [Saas Edition of Qlik Sense]                           |                     [Qlik Sense Enterprise]                      |                            [Qlik Sense Desktop]                            |
| :-----------------------------------------------------------------------------: | :--------------------------------------------------------------: | :------------------------------------------------------------------------: |
| Copy sn-table-ext into https://your-tenant.us.qlikcloud.com/console/extensions/ | Copy sn-table-ext into Qlik Management Console (QMC)->Extensions | Copy sn-table-ext into ..\Users\<UserName>\Documents\Qlik\Sense\Extensions |

## API

The API can also be found in [the Qlik developer portal](https://qlik.dev/apis/javascript/nebula-table)

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
