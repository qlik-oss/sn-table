import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';

import { TableContextProvider } from '../../context';
import TableWrapper from '../TableWrapper';
import TableBodyWrapper from '../TableBodyWrapper';
import TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleScroll from '../../utils/handle-scroll';
import {
  TableLayout,
  TableData,
  PageInfo,
  SetPageInfo,
  ExtendedTranslator,
  ExtendedTheme,
  Announce,
  Column,
  ChangeSortOrder,
  ExtendedSelectionAPI,
} from '../../../types';

describe('<TableWrapper />', () => {
  let tableData: TableData;
  let pageInfo: PageInfo;
  let setPageInfo: SetPageInfo;
  let constraints: stardust.Constraints;
  let selectionsAPI: ExtendedSelectionAPI;
  let modal: boolean;
  let rootElement: HTMLElement;
  let keyboard: stardust.Keyboard;
  let translator: ExtendedTranslator;
  let rect: stardust.Rect;
  let theme: ExtendedTheme;
  let direction: 'ltr' | 'rtl';
  let announce: Announce;
  let changeSortOrder: ChangeSortOrder;
  let layout: TableLayout;
  let isFlagEnabled: (flag: string) => boolean;

  const renderTableWrapper = () =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} tableRows={[]}>
        <TableWrapper
          tableData={tableData}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          constraints={constraints}
          selectionsAPI={selectionsAPI}
          rootElement={rootElement}
          keyboard={keyboard}
          translator={translator}
          rect={rect}
          theme={theme}
          direction={direction}
          announce={announce}
          changeSortOrder={changeSortOrder}
          layout={layout}
          isFlagEnabled={isFlagEnabled}
        />
      </TableContextProvider>
    );

  beforeEach(() => {
    // When wrapping a component in memo, the actual functional component is stored on type
    jest.spyOn(TableHeadWrapper, 'type').mockImplementation(() => <thead />);
    jest.spyOn(TableBodyWrapper, 'type').mockImplementation(() => <thead />);

    tableData = {
      totalRowCount: 200,
      totalColumnCount: 10,
      paginationNeeded: true,
      rows: [{ qText: '1' }],
      columns: [{}] as Column[],
    } as unknown as TableData;
    pageInfo = { page: 0, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
    setPageInfo = jest.fn();
    constraints = {};
    selectionsAPI = {
      isModal: () => modal,
    } as unknown as ExtendedSelectionAPI;
    modal = false;
    rootElement = {
      getElementsByClassName: () => [],
      getElementsByTagName: () => [{ clientHeight: {}, contains: jest.fn() }],
      querySelector: () => undefined,
    } as unknown as HTMLElement;
    keyboard = { enabled: false, active: false };
    translator = { get: (s: string) => s } as unknown as ExtendedTranslator;
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
    theme = {
      getStyle: () => undefined,
      table: {
        body: {
          borderColor: '',
        },
        pagination: {
          borderColor: '',
        },
      },
    } as unknown as ExtendedTheme;
  });

  afterEach(() => jest.clearAllMocks());

  it('should render table with pagination', () => {
    const { getByLabelText, getByText, getByTestId } = renderTableWrapper();

    expect(
      getByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(getByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(getByTestId('table-container').getAttribute('role')).toBe('application');
    // Just checking that the pagination has rendered, we do more thorough checking in the PaginationContent tests
    expect(getByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
  });

  it('should not render pagination when constraints.active is true', () => {
    constraints.active = true;
    const { getByLabelText, queryByText, getByTestId } = renderTableWrapper();

    expect(
      getByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(getByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(getByTestId('table-container').getAttribute('role')).toBe('application');
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
  });

  it('should call handleWrapperKeyDown when press control key on the table', () => {
    jest.spyOn(handleKeyPress, 'handleWrapperKeyDown').mockImplementation(() => jest.fn());
    const { getByLabelText } = renderTableWrapper();

    fireEvent.keyDown(getByLabelText('SNTable.Pagination.RowsPerPage:'), {
      key: 'Control',
      code: 'ControlLeft',
    });
    expect(handleKeyPress.handleWrapperKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleHorizontalScroll when scroll on the table', () => {
    jest.spyOn(handleScroll, 'handleHorizontalScroll').mockImplementation(() => jest.fn());
    const { getByTestId } = renderTableWrapper();

    fireEvent.wheel(getByTestId('table-container'), { deltaX: 100 });
    expect(handleScroll.handleHorizontalScroll).toHaveBeenCalledTimes(1);
  });
});
