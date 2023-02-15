import React from 'react';
import { render, screen } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import Wrapper from '../Wrapper';
import { TableData, TableLayout } from '../../../types';
import { TestableTable } from '../Table';
import FooterWrapper from '../../components/footer/FooterWrapper';
import TestWithProviders from '../../../__test__/test-with-providers';
import { getColumns, getTotalPosition } from '../../../handle-data';
import { EMPTY_TABLE_DATA } from '../../context/TableContext';
import { generateLayout } from '../../../__test__/generate-test-data';

jest.mock('../Table');
jest.mock('../../components/footer/FooterWrapper');

describe('<Wrapper />', () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let tableData: TableData;
  let paginationNeeded: boolean;
  const mockTable = TestableTable as jest.MockedFunction<typeof TestableTable>;
  mockTable.mockReturnValue(<div data-testid="table-container" />);
  const mockFooterWrapper = FooterWrapper as jest.MockedFunction<typeof FooterWrapper>;
  mockFooterWrapper.mockReturnValue(<div data-testid="footer-wrapper" />);

  const renderWrapper = () => {
    tableData = {
      ...EMPTY_TABLE_DATA,
      paginationNeeded,
      columns: getColumns(layout),
      totalsPosition: getTotalPosition(layout),
    };

    render(
      <TestWithProviders layout={layout} tableData={tableData}>
        <Wrapper rect={rect} tableData={tableData} />
      </TestWithProviders>
    );
  };

  beforeEach(() => {
    layout = generateLayout(5, 5, 20);
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
  });

  afterEach(() => jest.restoreAllMocks());

  it('should not render table with pagination', () => {
    paginationNeeded = false;
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.queryByTestId('footer-wrapper')).toBeNull();
  });

  it('should render table with pagination', () => {
    paginationNeeded = true;
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.getByTestId('footer-wrapper')).toBeVisible();
  });
});
