import getData from "./data";
import getPropertyPanelDefinition from "./property-panel";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { exportProperties, importProperties } from "./conversion";

const getExploration = (env) =>
  env.flags.isEnabled("PS_18291_TABLE_EXPLORATION") && {
    exploration: {
      component: "items",
      items: {
        columnHandler: {
          component: "column-handler",
          search: true,
          selectAll: false,
        },
      },
      classification: {
        tags: ["exploration"],
        exclusive: true,
      },
    },
  };

export default function ext(env) {
  return {
    definition: getPropertyPanelDefinition(env),
    ...getExploration(env),
    data: getData(env),
    support: {
      export: env.flags.isEnabled("PS_20907_TABLE_DOWNLOAD"),
      exportData: true,
      snapshot: env.flags.isEnabled("PS_20907_TABLE_DOWNLOAD"),
      viewData: false,
      exploration: true,
      cssScaling: true,
    },
    importProperties,
    exportProperties,
  };
}
