import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stardust } from '@nebula.js/stardust';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { TestableTable } from '../Table';
import { ExtendedSelectionAPI, PageInfo, TableLayout } from '../../../../types';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<Table />', () => {
  let measureTextMock: jest.Mock<{ width: number }>;
  let rect: stardust.Rect;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let paginationNeeded: boolean;
  let model: EngineAPI.IGenericObject;
  let selectionsAPI: ExtendedSelectionAPI;
  let isModal = false;
  let user: UserEvent;
  let constraints: stardust.Constraints;
  const dimensionCount = 2;
  const measureCount = 1;
  const rowCount = 5;

  const renderTable = () =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} model={model} layout={layout} constraints={constraints}>
        <TestableTable pageInfo={pageInfo} rect={rect} paginationNeeded={paginationNeeded} />
      </TestWithProviders>
    );

  beforeEach(() => {
    user = userEvent.setup();

    measureTextMock = jest.fn();
    const context = {
      measureText: measureTextMock,
    } as unknown as CanvasRenderingContext2D;
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
    measureTextMock.mockReturnValue({ width: 150 });

    layout = generateLayout(dimensionCount, measureCount, rowCount);

    rect = {
      width: 750,
      height: 750,
    } as unknown as stardust.Rect;

    pageInfo = {
      page: 0,
      rowsPerPage: 20,
      rowsPerPageOptions: [],
    };

    paginationNeeded = false;

    const dataPages = generateDataPages(rowCount, dimensionCount + measureCount);
    // Hack be able to tell the difference between dimension and measure values
    dataPages[0].qMatrix.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (colIdx < dimensionCount) {
          cell.qText = `dimension-c${colIdx}-r${rowIdx}`;
        } else {
          cell.qText = `measure-c${colIdx}-r${rowIdx}`;
        }

        cell.qElemNumber = rowIdx.toString();
      });
    });

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
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

    constraints = {};
  });

  afterEach(() => jest.restoreAllMocks());

  it('should render', async () => {
    renderTable();

    expect(screen.getByTestId('sticky-container')).toBeVisible();
    await waitFor(() => expect(screen.getByText('title-0')).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText('title-1')).toBeVisible()); // A header value
    await waitFor(() => expect(screen.getByText('dimension-c0-r0')).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText('dimension-c1-r0')).toBeVisible()); // A dimension value
    await waitFor(() => expect(screen.getByText('measure-c2-r0')).toBeVisible()); // A measure value
  });

  describe('selections', () => {
    it('should be able to select a dimension cell', async () => {
      const cellText = 'dimension-c0-r0';

      renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass('selected'));

      await waitFor(() => user.click(screen.getByText(cellText)));
      await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass('selected'));
    });

    it('should be able to select multiple cells', async () => {
      const dimCell0 = 'dimension-c0-r0';
      const dimCell1 = 'dimension-c0-r1';

      renderTable();

      await waitFor(() => expect(screen.getByText(dimCell0)).toBeVisible());

      await waitFor(() => expect(screen.getByText(dimCell0).parentNode).not.toHaveClass('selected'));
      await waitFor(() => expect(screen.getByText(dimCell1).parentNode).not.toHaveClass('selected'));

      await waitFor(() => user.click(screen.getByText(dimCell0)));
      await waitFor(() => expect(screen.getByText(dimCell0).parentNode).toHaveClass('selected'));

      await waitFor(() => user.click(screen.getByText(dimCell1)));
      await waitFor(() => expect(screen.getByText(dimCell1).parentNode).toHaveClass('selected'));
    });

    it('should be able to select and de-select a dimension cell', async () => {
      const cellText = 'dimension-c0-r0';

      renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText))); // select

      await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass('selected'));

      await waitFor(() => user.click(screen.getByText(cellText))); // de-select

      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass('selected'));
    });

    it('should not be able to select a measure cell', async () => {
      jest.spyOn(selectionsAPI, 'begin');
      const cellText = 'measure-c2-r0';

      renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText)));

      // It's difficult to verify "no side effects", as this could possibly produce a false positive
      // if there is a delay (async calls) before any change occurs
      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass('selected'));
      await waitFor(() => expect(screen.getByText(cellText).parentNode).not.toHaveClass('excluded'));
      await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
    });

    it('when a dimension has selection/s all other columns should be excluded', async () => {
      const cellText = 'dimension-c0-r0';

      renderTable();

      await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

      await waitFor(() => user.click(screen.getByText(cellText)));

      await waitFor(() => expect(screen.getByText('dimension-c1-r0').parentNode).toHaveClass('excluded'));
      await waitFor(() => expect(screen.getByText('measure-c2-r0').parentNode).toHaveClass('excluded'));
    });

    describe('constraints', () => {
      it('should not be able to select a cell with "active" and "select" constraints', async () => {
        constraints.active = true;
        constraints.select = true;
        jest.spyOn(selectionsAPI, 'begin');
        const cellText = 'dimension-c0-r0';

        renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass('inactive'));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });

      it('should not be able to select a cell with "active" constraints', async () => {
        constraints.active = true;
        jest.spyOn(selectionsAPI, 'begin');
        const cellText = 'dimension-c0-r0';

        renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass('inactive'));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });

      it('should not be able to select a cell with "select" constraints', async () => {
        constraints.select = true;
        jest.spyOn(selectionsAPI, 'begin');
        const cellText = 'dimension-c0-r0';

        renderTable();

        await waitFor(() => expect(screen.getByText(cellText)).toBeVisible());

        await waitFor(() => user.click(screen.getByText(cellText)));

        await waitFor(() => expect(screen.getByText(cellText).parentNode).toHaveClass('inactive'));
        await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
      });
    });
  });

  describe('totals', () => {
    const TOP_POSITION = 2;
    const BOTTOM_POSITION = 4;
    let totalRow: EngineAPI.INxCell;

    beforeEach(() => {
      totalRow = { qText: 'value' } as EngineAPI.INxCell;
      layout.qHyperCube.qGrandTotalRow = layout.qHyperCube.qMeasureInfo.map(() => totalRow);

      layout.totals = {
        show: true,
        position: 'top',
        label: 'totals label',
      };
    });

    it('should render with totals at the top when total is in auto mode', async () => {
      layout.totals.show = true;
      renderTable();

      await waitFor(() => {
        const body = screen.getByText('dimension-c0-r0').parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(TOP_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it('should render with totals at the top', async () => {
      layout.totals.show = false;
      renderTable();

      await waitFor(() => {
        const body = screen.getByText('dimension-c0-r0').parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(TOP_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it('should render with totals at the bottom', async () => {
      layout.totals.show = false;
      layout.totals.position = 'bottom';
      renderTable();

      await waitFor(() => {
        const body = screen.getByText('dimension-c0-r0').parentNode as ParentNode;
        const totals = screen.getByText(layout.totals.label).parentNode as ParentNode;
        expect(body.compareDocumentPosition(totals)).toBe(BOTTOM_POSITION);
      });
      await waitFor(() => expect(screen.getByText(layout.totals.label)).toBeVisible());
      await waitFor(() => expect(screen.getByText(totalRow.qText as string)).toBeVisible());
    });

    it('should render without totals', async () => {
      layout.totals.show = false;
      layout.totals.position = 'noTotals';
      renderTable();

      expect(screen.getByTestId('sticky-container')).toBeVisible();
      await waitFor(() => expect(screen.queryByText(layout.totals.label)).toBeNull());
      await waitFor(() => expect(screen.queryByText(totalRow.qText as string)).toBeNull());
    });
  });
});
