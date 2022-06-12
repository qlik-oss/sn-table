import React, { useState, useReducer, createContext, Dispatch, SetStateAction, DispatchWithoutAction } from 'react';
import PropTypes from 'prop-types';
import { stardust } from '@nebula.js/stardust';

import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';

interface TableContextProps {
  focusedCellCoord: number[];
  setFocusedCellCoord: Dispatch<SetStateAction<number[]>>;
  selectionState: unknown;
  selectionDispatch: DispatchWithoutAction;
}
export const TableContext = createContext({} as TableContextProps);

const ProviderWithSelector = createSelectorProvider(TableContext);

interface TableContextProviderProps {
  children: React.ReactNode;
  selectionsAPI: stardust.ObjectSelections;
  cellCoordMock: number[];
  selectionDispatchMock: React.DispatchWithoutAction;
}

export const TableContextProvider = ({
  children,
  selectionsAPI,
  cellCoordMock,
  selectionDispatchMock,
}: TableContextProviderProps) => {
  const [focusedCellCoord, setFocusedCellCoord] = useState(cellCoordMock || [0, 0]);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    rows: [],
    colIdx: -1,
    api: selectionsAPI,
  });

  return (
    <ProviderWithSelector
      value={{
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

TableContextProvider.defaultProps = {
  cellCoordMock: undefined,
  selectionDispatchMock: undefined,
};

TableContextProvider.propTypes = {
  children: PropTypes.any.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  cellCoordMock: PropTypes.arrayOf(PropTypes.number),
  selectionDispatchMock: PropTypes.func,
};
