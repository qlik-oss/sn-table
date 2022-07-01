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

export interface SelectedRows {
  [key: string]: number;
}

export interface SelectionState {
  rows: SelectedRows;
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

export interface SelectPayload {
  cell: TableCell;
  announce: (arg0: AnnounceArgs) => void;
  evt: React.KeyboardEvent<HTMLInputElement>;
}

export type SelectionActions =
  | { type: 'selectMultiValues' }
  | { type: 'reset' }
  | { type: 'clear' }
  | { type: 'select'; payload: SelectPayload };
