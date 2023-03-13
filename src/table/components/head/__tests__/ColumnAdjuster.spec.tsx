import React from 'react';
import { render, screen } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import ColumnAdjuster from '../ColumnAdjuster';
import TestWithProviders from '../../../../__test__/test-with-providers';
import { ColumnWidthTypes } from '../../../constants';
import { ApplyColumnWidths, Column } from '../../../../types';

describe('<ColumnAdjuster />', () => {
  let columns: Column[];
  let column: Column;
  let isLastColumn: boolean;
  let rootElement: HTMLElement;
  let applyColumnWidths: ApplyColumnWidths | undefined;
  let constraints: stardust.Constraints;

  const renderAdjuster = () =>
    render(
      <TestWithProviders constraints={constraints} rootElement={rootElement} applyColumnWidths={applyColumnWidths}>
        <ColumnAdjuster column={column} isLastColumn={isLastColumn} />
      </TestWithProviders>
    );

  beforeEach(() => {
    columns = [
      {
        label: 'col1',
        pageColIdx: 0,
        qApprMaxGlyphCount: 10,
        columnWidth: { type: ColumnWidthTypes.AUTO },
      } as Column,
    ];
    column = columns[0];
    isLastColumn = false;
    rootElement = {
      getBoundingClientRect: () => ({ height: 100 } as DOMRect),
    } as HTMLElement;
    applyColumnWidths = jest.fn();
    constraints = {};
  });

  it('should return null when applyColumnWidths is undefined', () => {
    applyColumnWidths = undefined;

    renderAdjuster();
    expect(screen.queryByTestId('sn-table-column-adjuster')).toBeNull();
  });

  it('should return null when constraints.active is true', () => {
    constraints.active = true;

    renderAdjuster();
    expect(screen.queryByTestId('sn-table-column-adjuster')).toBeNull();
  });

  it('should render adjuster component', () => {
    renderAdjuster();
    expect(screen.queryByTestId('sn-table-column-adjuster')).toBeInTheDocument();
  });
});
