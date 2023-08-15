import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { generateDataPages, generateLayout } from "../../../../../__test__/generate-test-data";
import TestWithProviders from "../../../../../__test__/test-with-providers";
import manageData from "../../../../../handle-data";
import { Cell, PageInfo, TableData } from "../../../../../types";
import * as handleKeyPress from "../../../../utils/handle-keyboard";
import * as handleClick from "../../../../utils/handle-mouse";
import * as getCellRenderer from "../../../utils/get-cell-renderer";
import TableBodyWrapper from "../TableBodyWrapper";

describe("<TableBodyWrapper />", () => {
  const setShouldRefocus = () => undefined;
  const tableWrapperRef = {} as React.MutableRefObject<HTMLDivElement | null>;
  const announce = () => undefined;
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;

  let tableData: TableData;
  let tableFirstRow: Cell;
  let tableSecondRow: Cell;

  const renderTableBody = () =>
    render(
      <TestWithProviders tableData={tableData}>
        <table>
          <TableBodyWrapper setShouldRefocus={setShouldRefocus} tableWrapperRef={tableWrapperRef} announce={announce} />
        </table>
      </TestWithProviders>
    );

  beforeEach(async () => {
    tableData = (await manageData(
      model,
      generateLayout(1, 1, 2, [], [{ qText: "100" }]),
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined
    )) as TableData;
    tableFirstRow = tableData.rows[0]["col-0"] as Cell;
    tableSecondRow = tableData.rows[0]["col-1"] as Cell;
    jest.spyOn(getCellRenderer, "default");
  });

  afterEach(() => jest.clearAllMocks());

  it("should render 2x2 table body and call CellRenderer, without totals", () => {
    const { queryByText } = renderTableBody();

    expect(getCellRenderer.default).toHaveBeenCalledTimes(2);
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableData.columns[0].totalInfo)).toBeNull();
  });

  it("should render table with totals", () => {
    tableData.totalsPosition.atTop = true;
    const { queryByText } = renderTableBody();

    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableFirstRow.qText as string)).toBeVisible();
    expect(queryByText(tableSecondRow.qText as string)).toBeVisible();
    expect(queryByText(tableData.columns[0].totalInfo)).toBeVisible();
  });

  it("should call handleBodyKeyDown on key down", () => {
    jest.spyOn(handleKeyPress, "handleBodyKeyDown");

    const { getByText } = renderTableBody();
    fireEvent.keyDown(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyDown).toHaveBeenCalledTimes(1);
  });

  it("should call handleMouseDownToFocusBody on mouseDown", () => {
    jest.spyOn(handleClick, "handleMouseDownToFocusBody").mockImplementation();

    const { getByText } = renderTableBody();
    fireEvent.mouseDown(getByText(tableFirstRow.qText as string));

    expect(handleClick.handleMouseDownToFocusBody).toHaveBeenCalledTimes(1);
  });

  it("should call handleBodyKeyUp on key up", () => {
    jest.spyOn(handleKeyPress, "handleBodyKeyUp");

    const { getByText } = renderTableBody();
    fireEvent.keyUp(getByText(tableFirstRow.qText as string));

    expect(handleKeyPress.handleBodyKeyUp).toHaveBeenCalledTimes(1);
  });
});
