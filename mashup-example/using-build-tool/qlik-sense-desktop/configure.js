/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { embed } from '@nebula.js/stardust';
// import table from '@nebula.js/sn-table';
// To load local sn-table extension
import table from '../../../core/esm/index';
import customTheme from '../../../theme/sense-dark-horizon';

const types = [
  {
    name: 'table',
    load: () => Promise.resolve(table),
  },
];

const themes = [
  {
    id: 'myTheme',
    load: () => Promise.resolve(customTheme),
  },
];

const nuked = embed.createConfiguration({
  types,
  themes,
  context: {
    theme: 'myTheme',
    language: 'en-US',
    keyboardNavigation: true,
    constraints: {
      // active: true - turn off interactions that affect the state
      // of the visual representation including selection, zoom, scroll, etc.
      active: false,
      // select: true - turn off selections.
      select: false,
      // passive: true - turn off interactions like tooltips.
      passive: false,
    },
  },
});

export default nuked;
