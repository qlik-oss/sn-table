import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';

import TableContainer from '../TableContainer';
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

  const renderTableContainer = () =>
    render(
      // Need to mock selectionDispatch since UPDATE_PAGE_ROWS action can create infinite loop
      <TableContextProvider selectionsAPI={selectionsAPI} selectionDispatchMock={jest.fn()}>
        <TableContainer
          model={model}
          pageInfo={pageInfo}
          rect={rect}
          layout={layout}
          paginationNeeded={paginationNeeded}
          theme={theme}
          selectionsAPI={selectionsAPI}
        />
      </TableContextProvider>
    );

  beforeEach(() => {
    measureTextMock = jest.fn();
    const context = {
      measureText: measureTextMock,
    } as unknown as CanvasRenderingContext2D;
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
    measureTextMock.mockReturnValue({ width: 150 });

    layout = generateLayout(1, 1, 5);

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

    model = {
      getHyperCubeData: jest.fn() as jest.MockedFunction<() => Promise<EngineAPI.INxPivotPage[]>>,
    } as unknown as EngineAPI.IGenericObject;
    (model.getHyperCubeData as jest.Mock).mockResolvedValue(generateDataPages(5, 2));

    theme = {
      getStyle: () => undefined,
      table: {
        body: { borderColor: '' },
        pagination: { borderColor: '' },
      },
    } as unknown as ExtendedTheme;

    selectionsAPI = { on: () => {}, removeListener: () => {}, isModal: () => false } as unknown as ExtendedSelectionAPI;
  });

  afterEach(() => jest.restoreAllMocks());

  it('should render', async () => {
    const { getByTestId, getByText } = renderTableContainer();

    expect(getByTestId('table-container')).toBeVisible();
    await waitFor(() => expect(getByText('title-1')).toBeVisible()); // A header value
    await waitFor(() => expect(getByText('1')).toBeVisible()); // A cell value
  });
});
