export interface Translator {
  get: (str: string, args?: string[]) => string;
  add: (item: { id: string; locale: object }) => void;
  language: () => string;
}

export interface HyperCube extends EngineAPI.IHyperCube {
  qColumnOrder: number[];
  textAlign: string;
}

export interface TableLayout extends EngineAPI.IGenericHyperCubeLayout {
  qHyperCube: HyperCube;
  totals: {
    show: boolean;
    position: 'top' | 'bottom' | 'noTotals';
    label: string;
  };
}

export interface Cell {
  qText?: string;
  qAttrExps: EngineAPI.INxAttributeExpressionValues;
  rowIdx: number;
  colIdx: number;
  isSelectable: boolean;
  rawRowIdx: number;
  rawColIdx: number;
  prevQElemNumber: number;
  nextQElemNumber: number;
}

export interface Row {
  // for the row key, string is needed
  [key: string]: Cell | string;
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

interface TextAlign {
  auto: boolean;
  align: string;
}

interface ExtendedNxAttrExprInfo extends EngineAPI.INxAttrExprInfo {
  id: string;
}

export interface ExtendedNxDimensionInfo extends Omit<EngineAPI.INxDimensionInfo, 'qAttrExprInfo'> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}

export interface ExtendedNxMeasureInfo extends Omit<EngineAPI.INxMeasureInfo, 'qAttrExprInfo'> {
  textAlign: TextAlign;
  qAttrExprInfo: ExtendedNxAttrExprInfo[];
}
