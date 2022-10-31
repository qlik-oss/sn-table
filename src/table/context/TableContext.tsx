import React, { useState, useReducer, createContext } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';
import { ExtendedSelectionAPI } from '../../types';
import { ContextValue, ContextProviderProps } from '../types';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import { SelectionActions } from '../constants';
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
  const [columnWidths, setColumnWidths] = useColumnWidth(columns, tableWidth);
  // const [tableWidths, setTableWidths] = useColumnWidths(tableWidth, columns);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    pageRows: rows,
    rows: {},
    colIdx: -1,
    api: selectionsAPI as ExtendedSelectionAPI, // TODO: update nebula api with correct selection api type
    isSelectMultiValues: false,
  });

  useDidUpdateEffect(() => {
    selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows: rows } });
  }, [rows]);

  // useDidUpdateEffect(() => {
  //   setColumnWidths(getColumnWidths(columns, tableWidth));
  // }, [columns, tableWidth]);

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
