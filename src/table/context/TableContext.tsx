import React, { useState, useReducer, createContext } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';
import { ExtendedSelectionAPI, ContextValue, ContextProviderProps } from '../../types';

export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

export const TableContextProvider = ({
  children,
  selectionsAPI,
  cellCoordMock,
  selectionDispatchMock,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
   const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    rows: {},
    colIdx: -1,
    api: selectionsAPI as ExtendedSelectionAPI, // TODO: update nebula api with correct selection api type
    isSelectMultiValues: false,
  });

  return (
    <ProviderWithSelector
      value={{
        headRowHeight,
        setHeadRowHeight,
        focusedCellCoord,
        setFocusedCellCoord,
        selectionState,
        selectionDispatch: selectionDispatchMock || selectionDispatch,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
