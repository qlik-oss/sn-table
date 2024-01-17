import { stardust } from "@nebula.js/stardust";
import { useEffect } from "react";
import { Row } from "../../../types";
import { SelectionActions } from "../../constants";
import { TableContext, useContextSelector } from "../../context";
import useSelectionListener from "../../hooks/use-selection-listener";

const keyboard = { enabled: false } as stardust.Keyboard; // TODO No keyboard navigation support
const setShouldRefocus = () => {}; // TODO No focus support
const tableWrapperRef = { current: null }; // TODO No focus support

export default function useSelectionsEffect(rowsInPage: Row[]) {
  const { selectionsAPI } = useContextSelector(TableContext, (value) => value.baseProps);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

  useEffect(() => {
    selectionDispatch({ type: SelectionActions.UPDATE_PAGE_ROWS, payload: { pageRows: rowsInPage } });
  }, [selectionDispatch, rowsInPage]);

  useSelectionListener({
    selectionsAPI,
    selectionDispatch,
    setShouldRefocus,
    keyboard,
    tableWrapperRef,
  });
}
