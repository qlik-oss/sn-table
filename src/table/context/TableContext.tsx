import React, { useState, createContext, useMemo } from 'react';

import { createSelectorProvider } from './createSelectorProvider';
import { ContextValue, ContextProviderProps } from '../types';
import useSelectionReducer from '../hooks/use-selection-reducer';
import { Row } from '../../types';

// In order to not have typing issues when using properties on the context,
// the initial value for the context is casted to ContextValue.
// In practice it will always be populated since TableContextProvider
// runs before anything using props on the context
export const TableContext = createContext<ContextValue>({} as ContextValue);

const ProviderWithSelector = createSelectorProvider(TableContext);

const EMPTY_PAGE_ROWS: Row[] = [];

export const TableContextProvider = ({
  children,
  selectionsAPI,
  pageRows = EMPTY_PAGE_ROWS, // Always use the same array to avoid triggers infinite loop in use-selection-reducer.ts
  cellCoordMock,
  selectionDispatchMock,
  layout,
  model,
  translator,
  constraints,
  theme,
  keyboard,
  rootElement,
  embed,
}: ContextProviderProps) => {
  const [headRowHeight, setHeadRowHeight] = useState(0);
  const [focusedCellCoord, setFocusedCellCoord] = useState((cellCoordMock || [0, 0]) as [number, number]);
  const [selectionState, selectionDispatch] = useSelectionReducer(pageRows, selectionsAPI);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const baseProps = useMemo(
    () => ({ selectionsAPI, layout, model, translator, constraints, theme, keyboard, rootElement, embed }),
    [selectionsAPI, layout, model, translator, constraints, theme.name(), keyboard, rootElement, embed] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ProviderWithSelector
      value={{
        headRowHeight,
        setHeadRowHeight,
        focusedCellCoord,
        setFocusedCellCoord,
        selectionState,
        selectionDispatch: selectionDispatchMock || selectionDispatch,
        hoverIndex,
        setHoverIndex,
        baseProps,
      }}
    >
      {children}
    </ProviderWithSelector>
  );
};
