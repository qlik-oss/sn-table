import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { generateDataPages, generateLayout } from "../../../../../__test__/generate-test-data";
import TestWithProviders from "../../../../../__test__/test-with-providers";
import manageData from "../../../../../handle-data";
import { ExtendedSelectionAPI, PageInfo, TableData, ViewService } from "../../../../../types";
import * as handleAccessibility from "../../../../utils/accessibility-utils";
import * as handleKeyPress from "../../../../utils/handle-keyboard";
import TableTotals from "../TableTotals";

describe("<TableTotals />", () => {
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) } as unknown as EngineAPI.IGenericObject;
  const layout = generateLayout(1, 1, 2, [], [{ qText: "350" }]);
  let viewService: ViewService;
  let tableData: TableData;
  let selectionsAPI: ExtendedSelectionAPI;

  const renderTableTotals = (isNewHeadCellMenuEnabled = false) =>
    render(
      <TestWithProviders
        selectionsAPI={selectionsAPI}
        tableData={tableData}
        isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
      >
        <table>
          <tbody>
            <TableTotals />
          </tbody>
        </table>
      </TestWithProviders>,
    );

  beforeEach(async () => {
    viewService = {} as ViewService;
    tableData = (await manageData(
      model,
      layout,
      { top: 0, height: 100 } as unknown as PageInfo,
      () => undefined,
      viewService,
    )) as TableData;
  });

  afterEach(() => jest.clearAllMocks());

  it("should show the total row when table totals", () => {
    const { queryByText } = renderTableTotals();
    expect(queryByText(tableData.columns[0].totalInfo)).toBeVisible();
    expect(queryByText(tableData.columns[1].totalInfo)).toBeVisible();
  });

  it("should call handleTotalKeyDown when keyDown on a total cell", () => {
    jest.spyOn(handleKeyPress, "handleTotalKeyDown").mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.keyDown(getByText(tableData.columns[0].totalInfo));
    expect(handleKeyPress.handleTotalKeyDown).toHaveBeenCalledTimes(1);
  });

  it("should call removeAndFocus when clicking a total cell", () => {
    jest.spyOn(handleAccessibility, "removeTabAndFocusCell").mockImplementation(() => jest.fn());
    const { getByText } = renderTableTotals();
    fireEvent.mouseDown(getByText(tableData.columns[0].totalInfo));
    expect(handleAccessibility.removeTabAndFocusCell).toHaveBeenCalledTimes(1);
  });

  describe("when isNewHeadCellMenuEnabled flag is true:", () => {
    it("should total cells have tab index of -1", () => {
      const { baseElement } = renderTableTotals(true);
      const tableCells = baseElement.querySelectorAll(".sn-table-cell");

      // we have two cells from layout generation
      expect(tableCells[0]).toHaveAttribute("tabindex", "-1");
      expect(tableCells[1]).toHaveAttribute("tabindex", "-1");
    });
  });
});
