import React, { useState, createContext, useMemo } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { ContextValue, ContextProviderProps } from '../types';
import useSelectionReducer from '../hooks/use-selection-reducer';
import useColumnWidth from '../hooks/use-column-widths';
import { TableData } from '../../types';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

const EMPTY_TABLE_DATA = { rows: [], columns: [] } as unknown as TableData;

export const TableContextProvider = ({
  children,
  tableData = EMPTY_TABLE_DATA, // Always use the same array to avoid triggers infinite loop in use-selection-reducer.ts
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
  updateColumnWidth,
  tableWidth = 0,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useSelectionReducer(tableData.rows, selectionsAPI);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [columnWidths, setColumnWidths] = useColumnWidth(tableData.columns, tableWidth);
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
      updateColumnWidth,
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
      updateColumnWidth,
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
