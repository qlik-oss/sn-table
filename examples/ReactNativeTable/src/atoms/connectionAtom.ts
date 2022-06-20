import {atom} from 'jotai';
import {loadable} from 'jotai/utils';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type ConnectionConfig = {
  tenant: string;
  apiKey: string;
  vizType: string;
};

export const connectionListAtom = atom<Array<ConnectionConfig>>([]);

export const loadStorageAtom = atom<Array<ConnectionConfig>>(async () => {
  try {
    const data = await AsyncStorage.getItem('@connections');
    if (data) {
      const list = JSON.parse(data);
      return list;
    }
    return [];
  } catch (error) {}
});

export const addConnectionListAtom = atom(
  null,
  async (get, set, update: ConnectionConfig) => {
    const list = get(connectionListAtom);
    set(connectionListAtom, [...list, update]);
  },
);

export const loadableConnectionListAtom = loadable(connectionListAtom);
export const loadableStorageAtom = loadable(loadStorageAtom);

const storage = createJSONStorage(() => AsyncStorage);
export const storedConnectionListAtom = atomWithStorage(
  '@connections',
  [],
  storage,
);

export const loadableStoredConnectionListAtom = loadable(
  storedConnectionListAtom,
);

export const selectedConnectionAtom = atom<ConnectionConfig | undefined>(
  undefined,
);
