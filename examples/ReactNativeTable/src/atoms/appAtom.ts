import {atom} from 'jotai';
import {atomWithReset, loadable} from 'jotai/utils';
import {selectedConnectionAtom} from './connectionAtom';

const schema = require('enigma.js/schemas/12.612.0.json');
const enigma = require('enigma.js');
const SessionUtilities = require('enigma.js/sense-utilities');

export type SelectedAppAtom = {
  appId: string;
};

export type ActiveConnection = {
  app: any;
  appLayout: any;
};

export type Viz = {
  model: any;
  layout: any;
};

export const selectedAppAtom = atomWithReset<SelectedAppAtom | undefined>(
  undefined,
);

const openAppAtom = atom(async get => {
  const selectedConnection = get(selectedConnectionAtom);
  const selectedApp = get(selectedAppAtom);

  const port = 443;
  const ttl = 3600000;
  const host = selectedConnection?.tenant;

  const url = SessionUtilities.buildUrl({
    host,
    port,
    secure: true,
    ttl,
    route: `app/${selectedApp?.appId}`,
  });

  const headers = {
    headers: {Authorization: `Bearer ${selectedConnection?.apiKey}`},
  };

  const config = {
    schema,
    url: encodeURI(url),
    createSocket: (_url: any) => new WebSocket(_url, null, headers),
  };

  const globalSession = enigma.create(config);
  const session = await globalSession.open();
  const app = await session.openDoc(selectedApp?.appId);
  const appLayout = await app.getAppLayout();
  return {app, appLayout};
});

const vizList = atom(async get => {
  const connection = get(selectedConnectionAtom);
  const session = get(openAppAtom);
  if (session?.app) {
    const objects = await session.app.getObjects({
      qData: {},
      qTypes: [connection?.vizType],
    });
    const pendingModels = objects.map((o: any) =>
      session.app.getObject(o.qInfo.qId),
    );
    const models = await Promise.all(pendingModels);
    return models;
  }
});

export const loadableOpenAppAtom = loadable(openAppAtom);
export const loadableVizList = loadable(vizList);

export const currentModelAtom = atom<any>(undefined);
