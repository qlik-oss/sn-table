import React from 'react';
import { stardust } from '@nebula.js/stardust';

export interface TableCell {
  qText: string | undefined;
  qAttrExps: EngineAPI.INxAttributeExpressionValues;
  qElemNumber: number;
  rowIdx: number;
  colIdx: number;
  isSelectable: boolean;
  rawRowIdx: number;
  rawColIdx: number;
  prevQElemNumber: number;
  nextQElemNumber: number;
}

export interface ExtendedSelectionAPI extends stardust.ObjectSelections {
  on(eventType: string, callback: () => void): void;
  removeListener(eventType: string, callback: () => void): void;
}

export interface ExtendedTranslator extends stardust.Translator {
  language(): string;
}

export interface SelectionState {
  rows: Record<string, number>;
  colIdx: number;
  api: ExtendedSelectionAPI;
  isSelectMultiValues: boolean;
}

export interface AnnounceArgs {
  keys: Array<string | Array<string>>;
  shouldBeAtomic?: boolean;
  politeness?: 'polite' | 'assertive' | 'off';
}

export type AnnounceFn = (arg0: AnnounceArgs) => void;

export interface ActionPayload {
  cell: TableCell;
  announce: (arg0: AnnounceArgs) => void;
  evt: React.KeyboardEvent | React.MouseEvent;
}

export interface ContextValue {
  headRowHeight: number;
  setHeadRowHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedCellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectionState: SelectionState;
  selectionDispatch: React.Dispatch<ActionPayload> | jest.Mock<any, any>;
}

export interface PaginationColors {
  borderColor: string;
  color: string;
  iconColor: string;
  disabledIconColor: string;
}
export interface TableThemeColors {
  tableBackgroundColorFromTheme: string;
  backgroundColor: string | undefined;
  isBackgroundTransparentColor: boolean;
  isBackgroundDarkColor: boolean;
  borderColor: string;
  body: object;
  pagination: PaginationColors;
}

export interface ExtendedTheme extends stardust.Theme {
  name(): string;
  table: TableThemeColors;
}

export interface HyperCube extends EngineAPI.IHyperCube {
  qColumnOrder: number[];
  textAlign: string;
}

export type TotalsPosition = 'top' | 'bottom' | 'noTotals';

export interface TableLayout extends EngineAPI.IGenericHyperCubeLayout {
  qHyperCube: HyperCube;
  totals: {
    show: boolean;
    position: 'top' | 'bottom' | 'noTotals';
    label: string;
  };
}

export interface Column {
  id: string;
  isDim: boolean;
  isLocked: boolean;
  dataColIdx: number;
  width: number;
  label: string;
  align: string;
  stylingInfo: string[];
  sortDirection: string;
}

export interface PageInfo {
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

export type SetPageInfo = stardust.SetStateFn<{
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}>;

export type Announce = ((arg0: AnnounceArgs) => void) | undefined;

export interface RenderProps {
  direction: 'ltr' | 'rtl';
  selectionsAPI: stardust.ObjectSelections;
  rootElement: HTMLElement;
  tableData: object;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  footerContainer: HTMLElement;
  announce: (...args: any[]) => any;
}
