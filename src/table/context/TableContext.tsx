import React, { useState, useReducer, createContext } from 'react';
import { stardust } from '@nebula.js/stardust';
import PropTypes from 'prop-types';
import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';

export const TableContext = createContext({});

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
  const [headRowHeight, setHeadRowHeight] = useState();
  const [focusedCellCoord, setFocusedCellCoord] = useState(cellCoordMock || [0, 0]);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    rows: {},
    colIdx: -1,
    api: selectionsAPI,
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
