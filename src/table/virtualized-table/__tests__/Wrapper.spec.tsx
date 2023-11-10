import { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import React from "react";
import { generateLayout } from "../../../__test__/generate-test-data";
import TestWithProviders from "../../../__test__/test-with-providers";
import { getColumns, getTotalPosition } from "../../../handle-data";
import { TableData, TableLayout, ViewService } from "../../../types";
import { EMPTY_TABLE_DATA } from "../../context/TableContext";
import { TestableTable } from "../Table";
import Wrapper from "../Wrapper";

jest.mock("../Table");
jest.mock("@qlik/nebula-table-utils/lib/components", () => ({
  PaginationFooter: jest.fn().mockReturnValue(<div data-testid="footer-wrapper" />),
}));

describe("<Wrapper />", () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let viewService: ViewService;
  let tableData: TableData;
  let model: EngineAPI.IGenericObject;

  const renderWrapper = async () => {
    const mockTable = TestableTable as jest.MockedFunction<typeof TestableTable>;
    mockTable.mockReturnValue(<div data-testid="table-container" />);

    const columns = await getColumns(layout, model);

    tableData = {
      ...EMPTY_TABLE_DATA,
      paginationNeeded: true,
      columns,
      totalsPosition: getTotalPosition(layout, viewService),
    };

    render(
      <TestWithProviders layout={layout} tableData={tableData} rect={rect}>
        <Wrapper />
      </TestWithProviders>
    );
  };

  beforeEach(() => {
    layout = generateLayout(5, 5, 20);
    viewService = {} as ViewService;
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
    model = {
      getEffectiveProperties: async () => Promise.resolve({ qHyperCubeDef: { qInterColumnSortOrder: [0] } }),
    } as unknown as EngineAPI.IGenericObject;
  });

  afterEach(() => jest.restoreAllMocks());

  it("should render table with pagination", async () => {
    await renderWrapper();

    expect(screen.getByTestId("table-container")).toBeVisible();
    expect(screen.getByTestId("footer-wrapper")).toBeVisible();
  });
});
