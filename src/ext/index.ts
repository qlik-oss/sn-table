import { exportProperties, importProperties } from "../conversion";
import exploration from "../exploration/exploration";
import getData from "./data";
import getPropertyPanelDefinition from "./property-panel";

export default function ext(env: any) {
  return {
    definition: getPropertyPanelDefinition(env),
    exploration,
    data: getData(env),
    support: {
      export: env.flags.isEnabled("PS_20907_TABLE_DOWNLOAD"),
      exportData: true,
      snapshot: env.flags.isEnabled("PS_20907_TABLE_DOWNLOAD"),
      viewData: false,
      exploration: true,
      cssScaling: true,
    },
    importProperties(exportFormat: any, initialProperties: any, extension: any, hypercubePath: string) {
      const defaultPropertyValues = {
        defaultDimension: extension.getDefaultDimensionProperties(),
        defaultMeasure: extension.getDefaultMeasureProperties(),
      };
      return importProperties({ exportFormat, initialProperties, extension, hypercubePath, defaultPropertyValues });
    },
    exportProperties(propertyTree: any, hyperCubePath: string) {
      return exportProperties({ propertyTree, hyperCubePath });
    },
  };
}
