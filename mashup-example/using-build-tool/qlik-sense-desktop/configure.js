import { embed } from '@nebula.js/stardust';
import table from '@nebula.js/sn-table';

const nuked = embed.createConfiguration({
  context: {
    theme: 'dark',
    language: 'en-US',
    keyboardNavigation: true,
    constraints: {
      active: true, // do not allow interactions
    },
  },
  types: [
    {
      name: 'table',
      load: () => Promise.resolve(table),
    },
  ],
});

export default nuked;
