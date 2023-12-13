import { exportProperties, importProperties } from "../conversion";
import getData from "../data/data";
import exploration from "../exploration/exploration";
import { ExportFormat, Galaxy, PropTree } from "../types";
import getPropertyPanelDefinition from "./property-panel";

export default function ext(env: Galaxy) {
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
    importProperties(
      exportFormat: ExportFormat,
      initialProperties: EngineAPI.IGenericHyperCubeProperties,
      extension: any,
      hypercubePath: string,
    ) {
      const defaultPropertyValues = {
        defaultDimension: extension.getDefaultDimensionProperties(),
        defaultMeasure: extension.getDefaultMeasureProperties(),
      };
      return importProperties({ exportFormat, initialProperties, extension, hypercubePath, defaultPropertyValues });
    },
    exportProperties(propertyTree: PropTree, hyperCubePath: string) {
      return exportProperties({ propertyTree, hyperCubePath });
    },
  };
}
