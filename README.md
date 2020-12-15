# sn-table

table supernova for nebula.js

<!-- ## Installing -->

<!-- If you use npm: `npm install @nebula.js/sn-table` -->
## Usage

```js
import { embed } from '@nebula.js/stardust';
import table from '@nebula.js/sn-table';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [{ // register the action button object
    name: 'table',
    load: () => Promise.resolve(table);
  }]
});

nuked.render({
  element,
  type: 'table',
});
```
