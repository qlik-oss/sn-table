import { useReducer } from "react";

import { ExtendedSelectionAPI, Row } from "../../types";
import { SelectionDispatch, SelectionState } from "../types";
import { reducer } from "../utils/selections-utils";

const useSelectionReducer = (
  pageRows: Row[],
  selectionsAPI: ExtendedSelectionAPI | undefined
): [SelectionState, SelectionDispatch] => {
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    pageRows,
    rows: {},
    colIdx: -1,
    api: selectionsAPI,
    isSelectMultiValues: false,
  });

  return [selectionState, selectionDispatch];
};

export default useSelectionReducer;
