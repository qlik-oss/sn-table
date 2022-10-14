import React, { useState, useReducer, createContext, useEffect } from 'react';
import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';
import { ExtendedSelectionAPI, Row } from '../../types';
import { ContextValue, ContextProviderProps } from '../types';
import useDidUpdateEffect from '../hooks/use-did-update-effect';
import { SelectionActions } from '../constants';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

export const TableContextProvider = ({
  children,
  selectionsAPI,
  pageRows = [],
  cellCoordMock,
  selectionDispatchMock,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    pageRows,
    rows: {},
    colIdx: -1,
    api: selectionsAPI as ExtendedSelectionAPI, // TODO: update nebula api with correct selection api type
    isSelectMultiValues: false,
  });
  let numberOfColumns = Object.keys((pageRows as Row[])[0]).length - 1;
  // When there is more that 5 columns, make the total more that 100%
  let percentage = Math.round(100 / (numberOfColumns > 5 ? 5 : numberOfColumns));
  let initialWidths = Array(numberOfColumns).fill(percentage);
  const [columnWidths, setColumnWidths] = useState(initialWidths);

  useDidUpdateEffect(() => {
    numberOfColumns = Object.keys((pageRows as Row[])[0]).length - 1;
    // When there is more that 5 columns, make the total more that 100%
    percentage = Math.round(100 / (numberOfColumns > 5 ? 5 : numberOfColumns));
    initialWidths = Array(numberOfColumns).fill(percentage);
    setColumnWidths(initialWidths);
    selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows } });
  }, [pageRows]);

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
