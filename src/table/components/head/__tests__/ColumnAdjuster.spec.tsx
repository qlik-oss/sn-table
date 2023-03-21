import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import ColumnAdjuster from '../ColumnAdjuster';
import TestWithProviders from '../../../../__test__/test-with-providers';
import { ColumnWidthTypes, KeyCodes } from '../../../constants';
import { ApplyColumnWidths, Column } from '../../../../types';

describe('<ColumnAdjuster />', () => {
  let columns: Column[];
  let column: Column;
  let isLastColumn: boolean;
  let rootElement: HTMLElement;
  let applyColumnWidths: ApplyColumnWidths | undefined;
  let columnWidths: number[];
  let setColumnWidths: React.Dispatch<React.SetStateAction<number[]>>;
  let constraints: stardust.Constraints;

  const renderAdjuster = () =>
    render(
      <TestWithProviders
        constraints={constraints}
        rootElement={rootElement}
        applyColumnWidths={applyColumnWidths}
        columnWidthsMock={columnWidths}
        setColumnWidthsMock={setColumnWidths}
      >
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
    columnWidths = [200, 200];
    setColumnWidths = jest.fn();
    constraints = {};
  });

  afterEach(() => jest.clearAllMocks());

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

  it('should change column width using keyboard', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster');
    expect(columnAdjuster).toBeInTheDocument();

    if (!columnAdjuster) return;

    // fireEvent.keyDown(columnAdjuster, { key: KeyCodes.LEFT });
    // fireEvent.keyDown(columnAdjuster, { key: KeyCodes.LEFT });
    // await waitFor(() => {
    //   expect(setColumnWidths).toHaveBeenNthCalledWith(1, [195, 200]);
    // });

    // fireEvent.keyDown(columnAdjuster, { key: KeyCodes.RIGHT });
    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.RIGHT });
    await waitFor(() => {
      expect(setColumnWidths).toHaveBeenNthCalledWith(1, [205, 200]);
    });

    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.SPACE });
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenNthCalledWith(1, { type: ColumnWidthTypes.PIXELS, pixels: 205 }, column);
    });
  });

  it('should not change column width when confirming with the same column width and not when canceling ', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster');
    expect(columnAdjuster).toBeInTheDocument();

    if (!columnAdjuster) return;

    // fireEvent.keyDown(columnAdjuster, { key: KeyCodes.RIGHT });
    // await waitFor(() => {
    //   expect(setColumnWidths).toHaveBeenNthCalledWith(1, [205, 200]);
    // });

    // fireEvent.keyDown(columnAdjuster, { key: KeyCodes.LEFT });
    // await waitFor(() => {
    //   expect(setColumnWidths).toHaveBeenNthCalledWith(2, [200, 200]);
    // });

    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.SPACE });
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenCalledTimes(0);
    });

    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.ESC });
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenCalledTimes(0);
    });
  });
});
