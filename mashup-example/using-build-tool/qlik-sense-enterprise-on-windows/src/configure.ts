import { embed } from '@nebula.js/stardust';
import enigma from 'enigma.js';
import schema from 'enigma.js/schemas/12.170.2.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import table from '@nebula.js/sn-table';

const config = {
  host: '<QSEoW url>', // 'xxxx' note: no http/https,
  appId: '<App id>', // 'xxxx-xxx-xxx-xxx-xxxxxxx',
};

const enigmaApp: EngineAPI.IGlobal = await enigma
  .create({
    schema,
    url: `wss://${config.host}/app/${config.appId}`,
  })
  .open();

const app = await enigmaApp.openDoc(config.appId);

const nuked = embed(app, {
  context: {
    theme: 'light',
    language: 'en-US',
    constraints: {
      active: false,
      passive: false,
      select: false,
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
