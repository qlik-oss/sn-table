import { TableCellProps } from '@mui/material';
import { stardust } from '@nebula.js/stardust';
import { VariableSizeGrid } from 'react-window';
import {
  Announce,
  Cell,
  ChangeSortOrder,
  Column,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  PageInfo,
  SetPageInfo,
  TableData,
  TableLayout,
  TotalsPosition,
  Row,
} from '../types';
import { SelectionActions } from './constants';

interface Action<T = any> {
  type: T;
}

export interface ActionPayload {
  cell: Cell;
  announce: Announce;
  evt: React.KeyboardEvent | React.MouseEvent;
}

export interface SelectAction extends Action<SelectionActions.SELECT> {
  payload: ActionPayload;
}
export interface SelectMultiStartAction extends Action<SelectionActions.SELECT_MULTI_START> {
  payload: { cell: Cell };
}
export interface SelectMultiAddAction extends Action<SelectionActions.SELECT_MULTI_ADD> {
  payload: ActionPayload;
}
export interface SelectMultiEndAction extends Action<SelectionActions.SELECT_MULTI_END> {}
export interface ResetAction extends Action<SelectionActions.RESET> {}
export interface ClearAction extends Action<SelectionActions.CLEAR> {}
export interface UpdateAllRowsAction extends Action<SelectionActions.UPDATE_ALL_ROWS> {
  payload: { allRows: Row[] };
}

export type SelectionActionTypes =
  | SelectAction
  | SelectMultiStartAction
  | SelectMultiAddAction
  | SelectMultiEndAction
  | ResetAction
  | ClearAction
  | UpdateAllRowsAction;

export type SelectionDispatch = React.Dispatch<SelectionActionTypes>;

export interface SelectionState {
  allRows: Row[];
  rows: Record<string, number>;
  colIdx: number;
  api: ExtendedSelectionAPI;
  isSelectMultiValues: boolean;
  firstCell?: Cell;
}

export interface ContextValue {
  headRowHeight: number;
  setHeadRowHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedCellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectionState: SelectionState;
  selectionDispatch: SelectionDispatch;
}

export interface GeneratedStyling {
  padding?: string;
  borderStyle: string;
  borderColor: string;
  fontFamily?: string;
  color?: string;
  fontSize?: string; // following the theme format so this should always be a string
  cursor?: string;
  borderWidth?: string;
  backgroundColor?: string;
  sortLabelColor?: string;
  hoverBackgroundColor?: string;
  hoverFontColor?: string;
}

export interface CellStyle {
  backgroundColor: string | undefined; // This is always set but could be undefined in the theme
  color: string;
  background?: string;
  selectedCellClass?: string;
}

export interface HandleWrapperKeyDownProps {
  evt: React.KeyboardEvent;
  totalRowCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage(pageIdx: number): void;
  setShouldRefocus(): void;
  keyboard: stardust.Keyboard;
  isSelectionMode: boolean;
}

export interface HandleHeadKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cellCoord: [number, number];
  column: Column;
  changeSortOrder: ChangeSortOrder;
  layout: TableLayout;
  isInteractionEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export interface HandleBodyKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cell: Cell;
  selectionDispatch: SelectionDispatch;
  isSelectionsEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  announce: Announce;
  keyboard: stardust.Keyboard;
  totalsPosition: TotalsPosition;
  paginationNeeded: boolean;
  selectionsAPI: ExtendedSelectionAPI;
  areBasicFeaturesEnabled: boolean;
}

export interface CellFocusProps {
  focusType: string;
  cell: HTMLTableCellElement | undefined;
}

export interface HandleResetFocusProps {
  focusedCellCoord: [number, number];
  rootElement: HTMLElement;
  shouldRefocus: React.MutableRefObject<boolean>;
  isSelectionMode: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  keyboard: stardust.Keyboard;
  announce: Announce;
  totalsPosition: string;
}

export interface ContextProviderProps {
  children: JSX.Element;
  selectionsAPI: ExtendedSelectionAPI;
  tableRows?: Row[];
  cellCoordMock?: [number, number];
  selectionDispatchMock?: jest.Mock<any, any>;
}

export interface RenderProps {
  direction?: 'ltr' | 'rtl';
  selectionsAPI: ExtendedSelectionAPI;
  rootElement?: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData?: TableData;
  pageInfo?: PageInfo;
  setPageInfo?: SetPageInfo;
  constraints?: stardust.Constraints;
  translator?: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard?: stardust.Keyboard;
  footerContainer?: HTMLElement;
  announce?: Announce;
  model?: EngineAPI.IGenericObject;
  manageData?(
    model: EngineAPI.IGenericObject | undefined,
    layout: TableLayout,
    pageInfo: PageInfo,
    setPageInfo: SetPageInfo
  ): Promise<TableData | null>;
  app?: EngineAPI.IApp;
  areBasicFeaturesEnabled?: boolean;
}

export interface CommonTableProps {
  tableData: TableData;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
}

export interface TableWrapperProps extends CommonTableProps {
  direction?: 'ltr' | 'rtl';
  selectionsAPI: ExtendedSelectionAPI;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  footerContainer?: HTMLElement;
  announce: Announce;
  areBasicFeaturesEnabled: boolean;
}

export interface TableHeadWrapperProps extends CommonTableProps {
  selectionsAPI: ExtendedSelectionAPI;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
}

export interface TableBodyWrapperProps extends CommonTableProps {
  selectionsAPI: ExtendedSelectionAPI;
  rootElement: HTMLElement;
  layout: TableLayout;
  constraints: stardust.Constraints;
  announce: Announce;
  setShouldRefocus(): void;
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | undefined>;
  areBasicFeaturesEnabled: boolean;
}

export interface TableTotalsProps extends CommonTableProps {
  rootElement: HTMLElement;
  layout: TableLayout;
  selectionsAPI: ExtendedSelectionAPI;
}

export interface PaginationContentProps extends CommonTableProps {
  direction?: 'ltr' | 'rtl';
  rect: stardust.Rect;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  footerContainer?: HTMLElement;
  announce: Announce;
  isSelectionMode: boolean;
  handleChangePage(pageIdx: number): void;
}

export interface FooterWrapperProps {
  children: JSX.Element;
  theme: ExtendedTheme;
  footerContainer?: HTMLElement;
}
export interface CellHOCProps extends TableCellProps {
  styling: CellStyle;
  cell: Cell;
  column: Column;
  announce: Announce;
  areBasicFeaturesEnabled: boolean;
}

export type CellHOC = (props: CellHOCProps) => JSX.Element;

export interface VirtualizedTableRenderProps {
  model?: EngineAPI.IGenericObject;
  layout: TableLayout;
  rect: stardust.Rect;
  theme: ExtendedTheme;
  direction?: 'ltr' | 'rtl';
}

export interface VirtualizedTableProps extends VirtualizedTableRenderProps {
  forwardRef: React.RefObject<VariableSizeGrid<any>>;
  innerForwardRef: React.RefObject<HTMLDivElement>;
  columns: Column[];
  columnWidth: number[];
  theme: ExtendedTheme;
}
