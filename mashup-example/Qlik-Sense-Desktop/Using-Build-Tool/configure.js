import { embed } from '@nebula.js/stardust';
import table from '@nebula.js/sn-table/core/esm/index';

const nuked = embed.createConfiguration({
  context: {
    theme: 'dark',
    language: 'zh-CN',
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
