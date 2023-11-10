import { generateLayout } from "../../__test__/generate-test-data";
import { ChangeSortOrder, Column, HyperCube, SortDirection, TableLayout } from "../../types";
import { sortingFactory } from "../use-sorting";

describe("use-sorting", () => {
  describe("sortingFactory", () => {
    it("should return undefined when model is undefined", async () => {
      const model = undefined;
      const changeSortOrder = sortingFactory(0, model, false);
      expect(changeSortOrder).toBeUndefined();
    });
  });

  describe("changeSortOrder", () => {
    let originalOrder: number[];
    let column: Column;
    let layout: TableLayout;
    let model: EngineAPI.IGenericObject;
    let changeSortOrder: (column: Column, sortDirection?: SortDirection) => Promise<void>;
    let expectedPatches: EngineAPI.INxPatch[];

    beforeEach(() => {
      originalOrder = [0, 1, 2, 3];
      layout = generateLayout(2, 2, 2);
      column = { isDim: true, colIdx: 1, qReverseSort: false, sortDirection: "A" } as Column;
      model = {
        applyPatches: jest.fn(),
        getEffectiveProperties: async () =>
          Promise.resolve({
            qHyperCubeDef: {
              qInterColumnSortOrder: originalOrder,
            } as unknown as HyperCube,
          }),
      } as unknown as EngineAPI.IGenericObject;
      changeSortOrder = sortingFactory(layout.qHyperCube.qDimensionInfo.length, model, false) as ChangeSortOrder;
    });

    afterEach(() => jest.clearAllMocks());

    it("should call apply patches with patch for second dimension first in sort order", async () => {
      expectedPatches = [
        {
          qPath: "/qHyperCubeDef/qInterColumnSortOrder",
          qOp: "Replace",
          qValue: "[1,0,2,3]",
        },
      ];

      await changeSortOrder(column);
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it("should call apply patches with patch for qReverseSort for dimension if isActivelySorted is true", async () => {
      column.isActivelySorted = true;
      expectedPatches = [
        {
          qPath: "/qHyperCubeDef/qDimensions/1/qDef/qReverseSort",
          qOp: "Replace",
          qValue: "true",
        },
      ];

      await changeSortOrder(column);
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });

    it("should call apply patches with another patch for qReverseSort for measure", async () => {
      column = { isDim: false, colIdx: 2, qReverseSort: false, isActivelySorted: true } as Column;
      originalOrder = [2, 0, 1, 3];
      expectedPatches = [
        {
          qPath: "/qHyperCubeDef/qMeasures/0/qDef/qReverseSort",
          qOp: "Replace",
          qValue: "true",
        },
      ];

      await changeSortOrder(column);
      expect(model.applyPatches).toHaveBeenCalledWith(expectedPatches, true);
    });
  });
});
