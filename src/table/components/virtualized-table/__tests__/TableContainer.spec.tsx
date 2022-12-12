import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stardust } from '@nebula.js/stardust';
import { TableContainer } from '../TableContainer';
import { ExtendedSelectionAPI, ExtendedTheme, PageInfo, TableLayout } from '../../../../types';
import { generateDataPages, generateLayout } from '../../../../__test__/generate-test-data';
import { TableContextProvider } from '../../../context';

describe('<TableContainer />', () => {
  let measureTextMock: jest.Mock<{ width: number }>;
  let rect: stardust.Rect;
  let layout: TableLayout;
  let pageInfo: PageInfo;
  let paginationNeeded: boolean;
  let model: EngineAPI.IGenericObject;
  let theme: ExtendedTheme;
  let selectionsAPI: ExtendedSelectionAPI;
  let isModal = false;
  const dimensionCount = 2;
  const measureCount = 1;
  const rowCount = 5;

  const renderTableContainer = () => ({
    user: userEvent.setup(),
    ...render(
      <TableContextProvider selectionsAPI={selectionsAPI} pageRows={[]}>
        <TableContainer
          model={model}
          pageInfo={pageInfo}
          rect={rect}
          layout={layout}
          paginationNeeded={paginationNeeded}
          theme={theme}
          selectionsAPI={selectionsAPI}
          constraints={{}}
        />
      </TableContextProvider>
    ),
  });

  beforeEach(() => {
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
      });
    });

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubeData as jest.Mock).mockResolvedValue(dataPages);

    theme = {
      getStyle: () => undefined,
      background: { isDark: false },
    } as unknown as ExtendedTheme;

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
  });

  afterEach(() => jest.restoreAllMocks());

  it('should render', async () => {
    const { getByTestId, getByText } = renderTableContainer();

    expect(getByTestId('table-container')).toBeVisible();
    await waitFor(() => expect(getByText('title-0')).toBeVisible()); // A header value
    await waitFor(() => expect(getByText('title-1')).toBeVisible()); // A header value
    await waitFor(() => expect(getByText('dimension-c0-r0')).toBeVisible()); // A dimension value
    await waitFor(() => expect(getByText('dimension-c1-r0')).toBeVisible()); // A dimension value
    await waitFor(() => expect(getByText('measure-c2-r0')).toBeVisible()); // A measure value
  });

  describe('selections', () => {
    it('should be able to select a dimension cell', async () => {
      const cellText = 'dimension-c0-r0';

      const { getByText, user } = renderTableContainer();

      await waitFor(() => expect(getByText(cellText)).toBeVisible());

      await waitFor(() => expect(getByText(cellText).parentNode).not.toHaveClass('selected'));

      user.click(getByText(cellText));

      await waitFor(() => expect(getByText(cellText).parentNode).toHaveClass('selected'));
    });

    it('should be able to select multiple cells', async () => {
      const dimCell0 = 'dimension-c0-r0';
      const dimCell1 = 'dimension-c0-r1';

      const { getByText, user } = renderTableContainer();

      await waitFor(() => expect(getByText(dimCell0)).toBeVisible());

      await waitFor(() => expect(getByText(dimCell0).parentNode).not.toHaveClass('selected'));
      await waitFor(() => expect(getByText(dimCell1).parentNode).not.toHaveClass('selected'));

      user.click(getByText(dimCell0));
      await waitFor(() => expect(getByText(dimCell0).parentNode).toHaveClass('selected'));

      user.click(getByText(dimCell1));
      await waitFor(() => expect(getByText(dimCell1).parentNode).toHaveClass('selected'));
    });

    it('should be able to select and de-select a dimension cell', async () => {
      const cellText = 'dimension-c0-r0';

      const { getByText, user } = renderTableContainer();

      await waitFor(() => expect(getByText(cellText)).toBeVisible());

      user.click(getByText(cellText)); // select

      await waitFor(() => expect(getByText(cellText).parentNode).toHaveClass('selected'));

      user.click(getByText(cellText)); // de-select

      await waitFor(() => expect(getByText(cellText).parentNode).not.toHaveClass('selected'));
    });

    it('should not be able to select a measure cell', async () => {
      jest.spyOn(selectionsAPI, 'begin');
      const cellText = 'measure-c2-r0';

      const { getByText, user } = renderTableContainer();

      await waitFor(() => expect(getByText(cellText)).toBeVisible());

      user.click(getByText(cellText));

      // It's difficult to verify "no side effects", as this could possibly produce a false positive
      // if there is a delay (async calls) before any change occurs
      await waitFor(() => expect(getByText(cellText).parentNode).not.toHaveClass('selected'));
      await waitFor(() => expect(getByText(cellText).parentNode).not.toHaveClass('excluded'));
      await waitFor(() => expect(selectionsAPI.begin).not.toHaveBeenCalled());
    });

    it('when a dimension has selection/s all other columns should be excluded', async () => {
      const cellText = 'dimension-c0-r0';

      const { getByText, user } = renderTableContainer();

      await waitFor(() => expect(getByText(cellText)).toBeVisible());

      user.click(getByText(cellText));

      await waitFor(() => expect(getByText('dimension-c1-r0').parentNode).toHaveClass('excluded'));
      await waitFor(() => expect(getByText('measure-c2-r0').parentNode).toHaveClass('excluded'));
    });
  });
});
