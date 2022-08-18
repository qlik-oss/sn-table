import React, { useState, useReducer, createContext } from 'react';
import { stardust } from '@nebula.js/stardust';
import PropTypes from 'prop-types';
import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';
import { ExtendedSelectionAPI, ContextValue } from '../../types';

export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

interface ContextProviderProps {
  children: JSX.Element;
  selectionsAPI: stardust.ObjectSelections;
  cellCoordMock: [number, number];
  selectionDispatchMock: jest.Mock<any, any>;
}

export const TableContextProvider = ({
  children,
  selectionsAPI,
  cellCoordMock,
  selectionDispatchMock,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState<number>(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState(cellCoordMock || [0, 0]);
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
