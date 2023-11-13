import { stardust } from "@nebula.js/stardust";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { generateDataPages, generateLayout } from "../../../__test__/generate-test-data";
import TestWithProviders from "../../../__test__/test-with-providers";
import { getColumns, getTotalPosition } from "../../../handle-data";
import { ExtendedSelectionAPI, PageInfo, TableData, TableLayout, ViewService } from "../../../types";
import { EMPTY_TABLE_DATA } from "../../context/TableContext";
import { TestableTable } from "../Table";

describe("<Table />", () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let viewService: ViewService;
  let pageInfo: PageInfo;
  let model: EngineAPI.IGenericObject;
  let selectionsAPI: ExtendedSelectionAPI;
  let isModal = false;
  let user: UserEvent;
  let interactions: stardust.Interactions;
  let tableData: TableData;
  let rootElement: HTMLElement;
  let dataPages: EngineAPI.INxDataPage[];
  const app = {} as EngineAPI.IApp;
  const dimensionCount = 2;
  const measureCount = 1;
  const rowCount = 5;

  const renderTable = async (initialDataPages?: EngineAPI.INxDataPage[]) => {
    tableData = {
      ...EMPTY_TABLE_DATA,
      paginationNeeded: false,
      columns: getColumns(layout),
      totalsPosition: getTotalPosition(layout, viewService),
    };

    await act(() =>
      render(
        <TestWithProviders
          app={app}
          selectionsAPI={selectionsAPI}
          model={model}
          layout={layout}
          interactions={interactions}
          tableData={tableData}
          rootElement={rootElement}
          rect={rect}
          initialDataPages={initialDataPages}
        >
          <TestableTable pageInfo={pageInfo} />
        </TestWithProviders>
      )
    );
  };

  beforeEach(() => {
    user = userEvent.setup();

    layout = generateLayout(dimensionCount, measureCount, rowCount);
    viewService = {} as ViewService;
    layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, 1, 2];
    rect = {
      width: 750,
      height: 750,
    } as unknown as stardust.Rect;

    pageInfo = {
      page: 0,
      rowsPerPage: 20,
      rowsPerPageOptions: [],
    };

    dataPages = generateDataPages(rowCount, dimensionCount + measureCount) as unknown as EngineAPI.INxDataPage[];
    // Hack be able to tell the difference between dimension and measure values
    dataPages[0].qMatrix.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (colIdx < dimensionCount) {
          cell.qText = `dimension-c${colIdx}-r${rowIdx}`;
        } else {
          cell.qText = `measure-c${colIdx}-r${rowIdx}`;
        }

        cell.qElemNumber = rowIdx;
      });
    });

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxDataPage[]>>,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubeData as jest.Mock).mockResolvedValue(dataPages);

    selectionsAPI = {
      on: () => {},
      removeListener: () => {},
      isModal: () => isModal,
      cancel: () => {
        isModal = false;
      },
      select: () => {},
      begin: () => {
        isModal = true;
      },
    } as unknown as ExtendedSelectionAPI;

    isModal = false;

    interactions = {
      active: true,
      passive: true,
      select: true,
    };

    rootElement = {
      getBoundingClientRect: () => ({ height: rect.height }),
    } as unknown as HTMLElement;
  });

  afterEach(() => jest.restoreAllMocks());

  it("should render without initial data pages", async () => {
    await renderTable(undefined);

    await waitFor(() => expect(screen.getByTestId("sticky-container")).toBeVisible());
    await waitFor(() => expect(screen.getByText("title-0")).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText("title-1")).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText("dimension-c0-r0")).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText("dimension-c1-r0")).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText("measure-c2-r0")).toBeVisible()); // A measure value
  });

  it("should render with initial data pages", async () => {
    (model.getHyperCubeData as jest.Mock).mockResolvedValue([]);
    await renderTable(dataPages);

    await waitFor(() => expect(screen.getByTestId("sticky-container")).toBeVisible());
    await waitFor(() => expect(screen.getByText("title-0")).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText("title-1")).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText("dimension-c0-r0")).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText("dimension-c1-r0")).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText("measure-c2-r0")).toBeVisible()); // A measure value
  });

  describe("selections", () => {
    it("should be able to select a dimension cell", async () => {
      const cellText = "dimension-c0-r0";

      await renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass("selected"));

      await waitFor(() => user.click(screen.getByText(cellText)));
      await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass("selected"));
    });

    it("should be able to select multiple cells", async () => {
      const dimCell0 = "dimension-c0-r0";
      const dimCell1 = "dimension-c0-r1";

      await renderTable();

      await waitFor(() => expect(screen.getByText(dimCell0)).toBeVisible());

      await waitFor(() => expect(screen.getByText(dimCell0).parentNode).not.toHaveClass("selected"));
      await waitFor(() => expect(screen.getByText(dimCell1).parentNode).not.toHaveClass("selected"));

      await waitFor(() => user.click(screen.getByText(dimCell0)));
      await waitFor(() => expect(screen.getByText(dimCell0).parentNode).toHaveClass("selected"));

      await waitFor(() => user.click(screen.getByText(dimCell1)));
      await waitFor(() => expect(screen.getByText(dimCell1).parentNode).toHaveClass("selected"));
    });

    it("should be able to select and de-select a dimension cell", async () => {
      const cellText = "dimension-c0-r0";

      await renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText))); // select

      await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass("selected"));

      await waitFor(() => user.click(screen.getByText(cellText))); // de-select

      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass("selected"));
    });

    it("should not be able to select a measure cell", async () => {
      jest.spyOn(selectionsAPI, "begin");
      const cellText = "measure-c2-r0";

      await renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText)));

      // It's difficult to verify "no side effects", as this could possibly produce a false positive
      // if there is a delay (async calls) before any change occurs
      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass("selected"));
      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass("excluded"));
      await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
    });

    it("when a dimension has selection/s all other columns should be excluded", async () => {
      const cellText = "dimension-c0-r0";

      await renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText)));

      await waitFor(() => expect(screen.getByText("dimension-c1-r0").parentNode).toHaveClass("excluded"));
      await waitFor(() => expect(screen.getByText("measure-c2-r0").parentNode).toHaveClass("excluded"));
    });

    describe("interactions", () => {
      it('should not be able to select a cell when "active" and "select" interactions are disabled', async () => {
        interactions.active = false;
        interactions.select = false;
        jest.spyOn(selectionsAPI, "begin");
        const cellText = "dimension-c0-r0";

        await renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass("inactive"));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });

      it('should not be able to select a cell when "active" interaction is disabled', async () => {
        interactions.active = false;
        jest.spyOn(selectionsAPI, "begin");
        const cellText = "dimension-c0-r0";

        await renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass("inactive"));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });

      it('should not be able to select a cell when "select" interaction is disabled', async () => {
        interactions.select = false;
        jest.spyOn(selectionsAPI, "begin");
        const cellText = "dimension-c0-r0";

        await renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass("inactive"));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });
    });
  });

  describe("totals", () => {
    const TOP_POSITION = 2;
    const BOTTOM_POSITION = 4;
    let totalRow: EngineAPI.INxCell;

    beforeEach(() => {
      totalRow = { qText: "value" } as EngineAPI.INxCell;
      layout.qHyperCube.qGrandTotalRow = layout.qHyperCube.qMeasureInfo.map(() => totalRow);

      layout.totals = {
        show: true,
        position: "top",
        label: "totals label",
      };
    });

    it("should render with totals at the top when total is in auto mode", async () => {
      layout.totals.show = true;
      await renderTable();

      await waitFor(() => {
        const body = screen.getByText("dimension-c0-r0").parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(TOP_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it("should render with totals at the top", async () => {
      layout.totals.show = false;
      await renderTable();

      await waitFor(() => {
        const body = screen.getByText("dimension-c0-r0").parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(TOP_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it("should render with totals at the bottom", async () => {
      layout.totals.show = false;
      layout.totals.position = "bottom";
      await renderTable();

      await waitFor(() => {
        const body = screen.getByText("dimension-c0-r0").parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(BOTTOM_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it("should render without totals", async () => {
      layout.totals.show = false;
      layout.totals.position = "noTotals";
      await renderTable();

      await waitFor(() => expect(screen.getByTestId("sticky-container")).toBeVisible());
      await waitFor(() => expect(screen.queryByText(layout.totals.label)).toBeNull());
      await waitFor(() => expect(screen.queryByText(totalRow.qText as string)).toBeNull());
    });
  });
});
