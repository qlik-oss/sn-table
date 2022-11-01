import React, { useState, createContext } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { ContextValue, ContextProviderProps } from '../types';
import useSelectionReducer from '../hooks/use-selection-reducer';
import useColumnWidth from '../hooks/use-column-widths';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

export const TableContextProvider = ({
  children,
  selectionsAPI,
  tableData,
  tableWidth,
  cellCoordMock,
  selectionDispatchMock,
}: ContextProviderProps) => {
  const { rows, columns } = tableData;
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useSelectionReducer(rows, selectionsAPI);
  const [columnWidths, setColumnWidths] = useColumnWidth(columns, tableWidth);

  return (
    <ProviderWithSelector
      value={{
        headRowHeight,
        setHeadRowHeight,
        focusedCellCoord,
        setFocusedCellCoord,
        selectionState,
        selectionDispatch: selectionDispatchMock || selectionDispatch,
        columnWidths,
        setColumnWidths,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
