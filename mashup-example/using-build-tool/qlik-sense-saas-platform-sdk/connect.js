import { Auth, AuthType } from "@qlik/sdk";
import enigma from "enigma.js";
import schema from "enigma.js/schemas/12.936.0.json";

export default async function connect({ url, webIntegrationId, appId }) {
  const authInstance = new Auth({
    webIntegrationId,
    autoRedirect: true,
    authType: AuthType.WebIntegration,
    host: url.replace(/^https?:\/\//, "").replace(/\/?/, ""),
  });

  if (!(await authInstance.isAuthenticated())) {
    authInstance.authenticate();
    return undefined;
  }

  const generatedURL = await authInstance.generateWebsocketUrl(appId);
  const enigmaGlobal = await enigma.create({ schema, url: generatedURL }).open();
  return enigmaGlobal.openDoc(appId);
}
