import React, { useState, createContext, useMemo } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { ContextValue, ContextProviderProps } from '../types';
import useSelectionReducer from '../hooks/use-selection-reducer';
import useColumnWidths from '../hooks/use-column-widths';
import useTableStyling from '../hooks/use-table-styling';
import { TableData } from '../../types';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

const EMPTY_TABLE_DATA = { rows: [], columns: [], totalsPosition: {} } as unknown as TableData;

export const TableContextProvider = ({
  children,
  tableData = EMPTY_TABLE_DATA, // Always use the same object to avoid triggers infinite loop in use-selection-reducer.ts
  selectionsAPI,
  cellCoordMock,
  selectionDispatchMock,
  layout,
  model,
  translator,
  constraints,
  theme,
  keyboard,
  rootElement,
  embed,
  changeSortOrder,
  applyColumnWidths,
  tableWidth = 0,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useSelectionReducer(tableData.rows, selectionsAPI);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [columnWidths, setColumnWidths] = useColumnWidths(tableData.columns, tableWidth);
  const styling = useTableStyling(layout, theme, tableData, rootElement);
  const baseProps = useMemo(
    () => ({
      selectionsAPI,
      layout,
      model,
      translator,
      constraints,
      theme,
      keyboard,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
    }),
    [
      selectionsAPI,
      layout,
      model,
      translator,
      constraints,
      theme.name(),
      keyboard,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
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
        selectionDispatch: selectionDispatchMock || selectionDispatch,
        hoverIndex,
        setHoverIndex,
        columnWidths,
        setColumnWidths,
        baseProps,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
