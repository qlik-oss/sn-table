import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import ColumnAdjuster from '../ColumnAdjuster';
import TestWithProviders from '../../../../__test__/test-with-providers';
import { ColumnWidthTypes, KeyCodes } from '../../../constants';
import { ApplyColumnWidths, Column } from '../../../../types';
import * as useColumnWidths from '../../../hooks/use-column-widths';

describe('<ColumnAdjuster />', () => {
  let columns: Column[];
  let column: Column;
  let isLastColumn: boolean;
  let applyColumnWidths: ApplyColumnWidths | undefined;
  let columnWidths: number[];
  let setColumnWidths: React.Dispatch<React.SetStateAction<number[]>>;
  let setYScrollbarWidth: React.Dispatch<React.SetStateAction<number>>;
  let interactions: stardust.Interactions;

  const renderAdjuster = () =>
    render(
      <TestWithProviders interactions={interactions} applyColumnWidths={applyColumnWidths}>
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
      {
        label: 'col2',
        pageColIdx: 1,
        qApprMaxGlyphCount: 10,
        columnWidth: { type: ColumnWidthTypes.AUTO },
      } as Column,
    ];
    column = columns[0];
    isLastColumn = false;
    applyColumnWidths = jest.fn();
    columnWidths = [200, 200];
    setColumnWidths = jest.fn();
    interactions = {
      active: true,
      passive: true,
      select: true,
    };
    jest
      .spyOn(useColumnWidths, 'default')
      .mockImplementation(() => [columnWidths, setColumnWidths, setYScrollbarWidth, false]);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return null when interactions.active is false', () => {
    interactions.active = false;

    renderAdjuster();
    expect(screen.queryByTestId('sn-table-column-adjuster')).toBeNull();
  });

  it('should render when interactions.active is not false', () => {
    renderAdjuster();
    expect(screen.queryByTestId('sn-table-column-adjuster')).toBeInTheDocument();
  });

  it('should change column width using keyboard', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster') as HTMLElement;

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
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster') as HTMLElement;

    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.SPACE });
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenCalledTimes(0);
    });

    fireEvent.keyDown(columnAdjuster, { key: KeyCodes.ESC });
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenCalledTimes(0);
    });
  });

  it('should change column width using mouse', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster') as HTMLElement;
    const coord = {
      clientX: 0,
      clientY: 0,
    };

    fireEvent.mouseDown(columnAdjuster, coord);
    coord.clientX = 100;
    fireEvent.mouseMove(columnAdjuster, coord);
    await waitFor(() => {
      expect(setColumnWidths).toHaveBeenNthCalledWith(1, [300, 200]);
    });

    fireEvent.mouseUp(columnAdjuster, coord);
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenNthCalledWith(1, { type: ColumnWidthTypes.PIXELS, pixels: 300 }, column);
    });
  });

  it('should not change column width using mouse when mouse is not moved', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster') as HTMLElement;

    fireEvent.mouseDown(columnAdjuster);
    fireEvent.mouseUp(columnAdjuster);
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenCalledTimes(0);
    });
  });

  it('should call applyColumnWidths with type fitToContent on double click', async () => {
    renderAdjuster();
    const columnAdjuster = screen.queryByTestId('sn-table-column-adjuster') as HTMLElement;

    fireEvent.doubleClick(columnAdjuster);
    await waitFor(() => {
      expect(applyColumnWidths).toHaveBeenNthCalledWith(1, { type: ColumnWidthTypes.FIT_TO_CONTENT }, column);
    });
  });
});
