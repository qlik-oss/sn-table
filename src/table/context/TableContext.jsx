import React, { useState, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { createSelectorProvider } from './createSelectorProvider';
import { reducer } from '../utils/selections-utils';

export const TableContext = createContext();

const ProviderWithSelector = createSelectorProvider(TableContext);

export const TableContextProvider = ({ selectionsAPI, children }) => {
  const [focusedCellCoord, setFocusedCellCoord] = useState([0, 0]);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    rows: [],
    colIdx: -1,
    api: selectionsAPI,
  });

  return (
    <ProviderWithSelector value={{ focusedCellCoord, setFocusedCellCoord, selectionState, selectionDispatch }}>
      {children}
    </ProviderWithSelector>
  );
};

TableContextProvider.propTypes = {
  children: PropTypes.any.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
};
