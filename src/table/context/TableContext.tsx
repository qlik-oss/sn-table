/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useMemo, useState } from "react";

import { TableData } from "../../types";
import { FIRST_HEADER_CELL_COORD } from "../constants";
import useColumnWidths from "../hooks/use-column-widths";
import useSelectionReducer from "../hooks/use-selection-reducer";
import useTableStyling from "../hooks/use-table-styling";
import { ContextProviderProps, ContextValue } from "../types";
import { createSelectorProvider } from "./createSelectorProvider";

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

export const EMPTY_TABLE_DATA = { rows: [], columns: [], totalsPosition: {} } as unknown as TableData;

export const TableContextProvider = ({
  app,
  children,
  tableData = EMPTY_TABLE_DATA, // Always use the same object to avoid triggers infinite loop in use-selection-reducer.ts
  selectionsAPI,
  cellCoordMock,
  layout,
  model,
  translator,
  interactions,
  theme,
  keyboard,
  rootElement,
  embed,
  changeSortOrder,
  applyColumnWidths,
  setPage,
  pageInfo,
  initialDataPages,
  rect,
  viewService,
  isNewHeadCellMenuEnabled,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState<[number, number]>(cellCoordMock || FIRST_HEADER_CELL_COORD);
  const [selectionState, selectionDispatch] = useSelectionReducer(tableData.rows, selectionsAPI);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const styling = useTableStyling(layout, theme, tableData, rootElement);
  const [columnWidths, setColumnWidths, setYScrollbarWidth, showRightBorder] = useColumnWidths(
    tableData.columns,
    tableData.totalsPosition,
    rect.width,
    styling,
  );
  const featureFlags = { isNewHeadCellMenuEnabled };
  const baseProps = useMemo(
    () => ({
      app,
      selectionsAPI,
      layout,
      model,
      translator,
      interactions,
      theme,
      keyboard,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
      rect,
      viewService,
    }),
    [
      app,
      selectionsAPI,
      layout,
      model,
      translator,
      interactions,
      theme.name(),
      keyboard.active,
      rootElement,
      embed,
      changeSortOrder,
      applyColumnWidths,
      styling,
      rect,
      viewService,
    ],
  );

  return (
    <ProviderWithSelector
      value={{
        headRowHeight,
        setHeadRowHeight,
        focusedCellCoord,
        setFocusedCellCoord,
        selectionState,
        selectionDispatch,
        hoverIndex,
        setHoverIndex,
        columnWidths,
        setColumnWidths,
        baseProps,
        tableData,
        setYScrollbarWidth,
        setPage,
        pageInfo,
        initialDataPages,
        showRightBorder,
        featureFlags,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
