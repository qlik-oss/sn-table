import { TableCellProps } from '@mui/material';
import { stardust } from '@nebula.js/stardust';
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
} from '../types';
import { TSelectionActions } from './utils/selections-utils';

export interface SelectionState {
  rows: Record<string, number>;
  colIdx: number;
  api: ExtendedSelectionAPI;
  isSelectMultiValues: boolean;
}

export interface ActionPayload {
  cell: Cell;
  announce: Announce;
  evt: React.KeyboardEvent | React.MouseEvent;
}

export interface ContextValue {
  headRowHeight: number;
  setHeadRowHeight: React.Dispatch<React.SetStateAction<number>>;
  focusedCellCoord: [number, number];
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectionState: SelectionState;
  selectionDispatch: React.Dispatch<TSelectionActions> | jest.Mock<any, any>;
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
  isSortingEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export interface HandleBodyKeyDownProps {
  evt: React.KeyboardEvent;
  rootElement: HTMLElement;
  cell: Cell;
  selectionDispatch: React.Dispatch<TSelectionActions>;
  isSelectionsEnabled: boolean;
  setFocusedCellCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
  announce: Announce;
  keyboard: stardust.Keyboard;
  totalsPosition: TotalsPosition;
  paginationNeeded: boolean;
  selectionsAPI: ExtendedSelectionAPI;
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
}

export interface ContextProviderProps {
  children: JSX.Element;
  selectionsAPI: ExtendedSelectionAPI;
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
}

export interface TableWrapperProps {
  direction?: 'ltr' | 'rtl';
  selectionsAPI: ExtendedSelectionAPI;
  rootElement: HTMLElement;
  layout: TableLayout;
  changeSortOrder: ChangeSortOrder;
  rect: stardust.Rect;
  tableData: TableData;
  pageInfo: PageInfo;
  setPageInfo: SetPageInfo;
  constraints: stardust.Constraints;
  translator: ExtendedTranslator;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
  footerContainer?: HTMLElement;
  announce: Announce;
}

export type TableHeadWrapperProps = Omit<
  TableWrapperProps,
  'rect' | 'pageInfo' | 'setPageInfo' | 'footerContainer' | 'announce'
>;

export interface TableBodyWrapperProps
  extends Omit<
    TableWrapperProps,
    'changeSortOrder' | 'pageInfo' | 'setPageInfo' | 'translator' | 'footContainer' | 'rect'
  > {
  setShouldRefocus(): void;
  tableWrapperRef: React.MutableRefObject<HTMLDivElement | undefined>;
  children: JSX.Element;
}

export interface TableTotalsProps {
  rootElement: HTMLElement;
  tableData: TableData;
  layout: TableLayout;
  theme: ExtendedTheme;
  keyboard: stardust.Keyboard;
}

export interface PaginationContentProps
  extends Omit<TableWrapperProps, 'selectionsAPI' | 'rootElement' | 'layout' | 'changeSortOrder'> {
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
}

export type CellHOC = (props: CellHOCProps) => JSX.Element;
