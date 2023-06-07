import React, { useState, createContext, useMemo } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { ContextValue, ContextProviderProps } from '../types';
import useSelectionReducer from '../hooks/use-selection-reducer';
import useColumnWidths from '../hooks/use-column-widths';
import useTableStyling from '../hooks/use-table-styling';
import { TableData } from '../../types';
import { FIRST_HEADER_CELL_COORD } from '../constants';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

export const EMPTY_TABLE_DATA = { rows: [], columns: [], totalsPosition: {} } as unknown as TableData;

export const TableContextProvider = ({
  app,
  children,
  tableData = EMPTY_TABLE_DATA, // Always use the same object to avoid triggers infinite loop in use-selection-reducer.ts
  selectionsAPI,
  cellCoordMock,
  layout,
  model,
  translator,
  interactions,
  theme,
  keyboard,
  rootElement,
  embed,
  changeSortOrder,
  applyColumnWidths,
  setPage,
  pageInfo,
  initialDataPages,
  rect,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState<[number, number]>(cellCoordMock || FIRST_HEADER_CELL_COORD);
  const [selectionState, selectionDispatch] = useSelectionReducer(tableData.rows, selectionsAPI);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const styling = useTableStyling(layout, theme, tableData, rootElement);
  const [columnWidths, setColumnWidths, setYScrollbarWidth, showRightBorder] = useColumnWidths(
    tableData.columns,
    tableData.totalsPosition,
    rect.width,
    styling
  );
  const baseProps = useMemo(
    () => ({
      app,
      selectionsAPI,
      layout,
      model,
      translator,
      interactions,
      theme,
      keyboard,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
      rect,
    }),
    [
      app,
      selectionsAPI,
      layout,
      model,
      translator,
      interactions,
      theme.name(),
      keyboard.active,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
      rect,
    ]
  );

  return (
    <ProviderWithSelector
      value={{
        headRowHeight,
        setHeadRowHeight,
        focusedCellCoord,
        setFocusedCellCoord,
        selectionState,
        selectionDispatch,
        hoverIndex,
        setHoverIndex,
        columnWidths,
        setColumnWidths,
        baseProps,
        tableData,
        setYScrollbarWidth,
        setPage,
        pageInfo,
        initialDataPages,
        showRightBorder,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
