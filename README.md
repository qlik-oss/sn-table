[![CircleCI](https://circleci.com/gh/qlik-oss/sn-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/maintainability)](https://codeclimate.com/github/qlik-oss/sn-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/cffe9ecd336c16de6dc2/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-table/test_coverage)

# sn-table

Table supernova for [nebula.js]

More specifics and information about the sn-table can be found in [the Qlik developer portal](https://qlik.dev/libraries-and-tools/visualizations/table).

## Mashup Usage

### Installing

If you use npm:

`npm install @nebula.js/sn-table`

Or without build tool, You can also load the sn-table through the script tag from [unpkg](https://unpkg.com/@nebula.js/sn-table).

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

[Check full examples](./mashup-example) of the mashup usage.

## Visualization Extension Usage

### Building and adding the sn-table extension to Qlik Sense

Install all dependencies:

```sh
yarn
```

Build a nebula.js visualization as a Qlik Sense extension:

```sh
yarn build
```

Compress the generated 'sn-table-ext' folder into the 'application/zip' file format

|                          [Saas Edition of Qlik Sense]                           |                     [Qlik Sense Enterprise]                      |                            [Qlik Sense Desktop]                            |
| :-----------------------------------------------------------------------------: | :--------------------------------------------------------------: | :------------------------------------------------------------------------: |
| Copy sn-table-ext into https://your-tenant.us.qlikcloud.com/console/extensions/ | Copy sn-table-ext into Qlik Management Console (QMC)->Extensions | Copy sn-table-ext into ..\Users\<UserName>\Documents\Qlik\Sense\Extensions |

## React Native

SN-Table supports react-native rendering. It uses the native implementation of the optimized lists on their respective platforms. For iOS it uses UICollectionView and for Android it uses RecyclerView. For more information on React Native integration with Nebula and Picasso, see the following repos;

- [Helium](https://github.com/qlik-oss/react-native-helium) -> A high performnce rendering engine that uses a GPU backed Skia implementation
- [Carbon](https://github.com/qlik-oss/react-native-carbon) -> The business logic behind rendering Supernova's in React Native
- [react-native-simple-grid](https://github.com/qlik-oss/react-native-simple-grid) -> The native sn-table

To run the example app in React-Native;

### Pre-reqs

1. Install [react-native dev environment](https://reactnative.dev/docs/0.68/environment-setup). This includes Xcode and Android Studio.
2. A QCS Account with an API Key
3. An app with a table.

### Running

** Please Note this can take a while to build if it's the first time **

1. `yarn`
2. `yarn setup:rn:dev`
3. `yarn ios`

## API

The API can also be found in [the Qlik developer portal](https://qlik.dev/apis/javascript/nebula-table)

## Contribution

To learn how to run a sn-table extension using nebula development server and develop, see our [contributing guide](./.github/CONTRIBUTION.md).

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
