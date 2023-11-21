import { ExportFormat } from "../../types";
import importViewDataProperties from "../import-view-data-properties";

describe("importViewDataProperties", () => {
  describe("importViewDataProperties", () => {
    const exportFormat = {
      data: [
        {
          dimensions: [],
          measures: [],
          excludedDimensions: [],
          excludedMeasures: [],
          interColumnSortOrder: [0, 1, 2],
        },
      ],
      properties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qColumnOrder: [0, 1, 2],
          columnWidths: [300, -1, 400],
        },
      },
    } as unknown as ExportFormat;
    const initialProperties = {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
      },
    } as unknown as EngineAPI.IGenericHyperCubeProperties;
    const hypercubePath = undefined;

    it("should get the correct importProperties and include view data properties", () => {
      const propertyTree = importViewDataProperties({ exportFormat, initialProperties, hypercubePath });
      expect(propertyTree.qProperty.totals?.show).toEqual(false);
      expect(propertyTree.qProperty.usePagination).toEqual(true);
    });
  });
});
