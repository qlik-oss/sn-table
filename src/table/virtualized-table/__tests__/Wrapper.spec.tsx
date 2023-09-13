import { stardust } from "@nebula.js/stardust";
import { render, screen } from "@testing-library/react";
import React from "react";
import { generateLayout } from "../../../__test__/generate-test-data";
import TestWithProviders from "../../../__test__/test-with-providers";
import { getColumns, getTotalPosition } from "../../../handle-data";
import { TableData, TableLayout, ViewService } from "../../../types";
import FooterWrapper from "../../components/footer/FooterWrapper";
import { EMPTY_TABLE_DATA } from "../../context/TableContext";
import { TestableTable } from "../Table";
import Wrapper from "../Wrapper";

jest.mock("../Table");
jest.mock("../../components/footer/FooterWrapper");

describe("<Wrapper />", () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let viewService: ViewService;
  let tableData: TableData;
  let paginationNeeded: boolean;

  const renderWrapper = () => {
    const mockTable = TestableTable as jest.MockedFunction<typeof TestableTable>;
    mockTable.mockReturnValue(<div data-testid="table-container" />);
    const mockFooterWrapper = FooterWrapper as jest.MockedFunction<typeof FooterWrapper>;
    mockFooterWrapper.mockReturnValue(<div data-testid="footer-wrapper" />);

    tableData = {
      ...EMPTY_TABLE_DATA,
      paginationNeeded,
      columns: getColumns(layout),
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
  });

  afterEach(() => jest.restoreAllMocks());

  it("should not render table with pagination", () => {
    paginationNeeded = false;
    renderWrapper();

    expect(screen.getByTestId("table-container")).toBeVisible();
    expect(screen.queryByTestId("footer-wrapper")).toBeNull();
  });

  it("should render table with pagination", () => {
    paginationNeeded = true;
    renderWrapper();

    expect(screen.getByTestId("table-container")).toBeVisible();
    expect(screen.getByTestId("footer-wrapper")).toBeVisible();
  });
});
