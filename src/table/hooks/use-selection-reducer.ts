import { useReducer } from 'react';

import { ExtendedSelectionAPI, Row } from '../../types';
import { SelectionDispatch, SelectionState } from '../types';
import { reducer } from '../utils/selections-utils';
// import { SelectionActions } from '../constants';
// import useDidUpdateEffect from './use-did-update-effect';

const useSelectionReducer = (
  pageRows: Row[],
  selectionsAPI: ExtendedSelectionAPI
): [SelectionState, SelectionDispatch] => {
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    pageRows,
    rows: {},
    colIdx: -1,
    api: selectionsAPI as ExtendedSelectionAPI, // TODO: update nebula api with correct selection api type
    isSelectMultiValues: false,
  });

  // useDidUpdateEffect(() => {
  //   selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows } });
  // }, [pageRows]);

  return [selectionState, selectionDispatch];
};

export default useSelectionReducer;
