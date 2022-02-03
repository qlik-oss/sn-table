import { embed } from '@nebula.js/stardust';

import table from '@nebula.js/sn-table';

const n = embed.createConfiguration({
  context: {
    theme: 'light',
    language: 'en-US',
  },
  types: [
    {
      name: 'table',
      load: () => Promise.resolve(table),
    },
  ],
});

export default n;
