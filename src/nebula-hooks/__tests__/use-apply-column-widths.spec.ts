import { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { ColumnWidthType } from "@qlik/nebula-table-utils/lib/constants";
import { generateLayout } from "../../__test__/generate-test-data";
import { ApplyColumnWidths, Column, HyperCube } from "../../types";
import { applyColumnWidthsFactory } from "../use-apply-column-widths";

describe("applyColumnWidths", () => {
  const dimPath = "/qHyperCubeDef/qDimensions/0/qDef/columnWidth";
  const meaPath = "/qHyperCubeDef/qMeasures/0/qDef/columnWidth";
  const oldColumnWidth = { type: ColumnWidthType.Percentage, percentage: 20 };
  let model: EngineAPI.IGenericObject;
  let qHyperCube: HyperCube;
  let newColumnWidth: ColumnWidth;
  let column: Column;
  let applyColumnWidths: ApplyColumnWidths;

  beforeEach(() => {
    model = {
      applyPatches: jest.fn(),
    } as unknown as EngineAPI.IGenericObject;
    // eslint-disable-next-line prefer-destructuring
    qHyperCube = generateLayout(1, 1, 10).qHyperCube;
    column = {
      isDim: true,
      colIdx: 0,
    } as unknown as Column;
    newColumnWidth = {
      type: ColumnWidthType.Pixels,
      pixels: 200,
    };

    applyColumnWidths = applyColumnWidthsFactory(qHyperCube, model);
  });

  afterEach(() => jest.clearAllMocks());

  it("should call applyPatches with qOp Add for dimension", () => {
    applyColumnWidths(newColumnWidth, column);
    expect(model.applyPatches).toHaveBeenCalledWith(
      [{ qPath: dimPath, qOp: "Add", qValue: JSON.stringify(newColumnWidth) }],
      true,
    );
  });

  it("should call applyPatches with qOp Replace for dimension", () => {
    qHyperCube.qDimensionInfo[0].columnWidth = oldColumnWidth;

    applyColumnWidths(newColumnWidth, column);
    expect(model.applyPatches).toHaveBeenCalledWith(
      [{ qPath: dimPath, qOp: "Replace", qValue: JSON.stringify({ ...oldColumnWidth, ...newColumnWidth }) }],
      true,
    );
  });

  it("should call applyPatches with qOp Add for measure", () => {
    column = { isDim: false, colIdx: 1 } as unknown as Column;

    applyColumnWidths(newColumnWidth, column);
    expect(model.applyPatches).toHaveBeenCalledWith(
      [{ qPath: meaPath, qOp: "Add", qValue: JSON.stringify(newColumnWidth) }],
      true,
    );
  });

  it("should call applyPatches with qOp Replace for measure", () => {
    column = { isDim: false, colIdx: 1 } as unknown as Column;
    qHyperCube.qMeasureInfo[0].columnWidth = { type: ColumnWidthType.Percentage, percentage: 20 };

    applyColumnWidths(newColumnWidth, column);
    expect(model.applyPatches).toHaveBeenCalledWith(
      [{ qPath: meaPath, qOp: "Replace", qValue: JSON.stringify({ ...oldColumnWidth, ...newColumnWidth }) }],
      true,
    );
  });
});
