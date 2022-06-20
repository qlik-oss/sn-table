import {atom} from 'jotai';
import {loadable} from 'jotai/utils';

import {
  selectedConnectionAtom,
  connectionListAtom,
  loadableConnectionListAtom,
  loadableStoredConnectionListAtom,
  storedConnectionListAtom,
} from './connectionAtom';

import {
  selectedAppAtom,
  loadableOpenAppAtom,
  loadableVizList,
  currentModelAtom,
} from './appAtom';

export const appListAtom = atom(async get => {
  try {
    const connectionConfig = get(selectedConnectionAtom);
    const result = await fetch(
      `https://${connectionConfig?.tenant}/api/v1/items?resourceType=app&limit=20`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${connectionConfig?.apiKey}`,
        },
      },
    );
    return await result.json();
  } catch (error) {}
});

export const loadableAppListAtom = loadable(appListAtom);

export {
  selectedConnectionAtom,
  connectionListAtom,
  loadableConnectionListAtom,
  loadableStoredConnectionListAtom,
  selectedAppAtom,
  loadableOpenAppAtom,
  loadableVizList,
  storedConnectionListAtom,
  currentModelAtom,
};
