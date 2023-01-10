import { stardust } from '@nebula.js/stardust';
import { DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from '../constants';
import { StickyContainerRect, TableRect } from '../types';

export const toStickyContainerRect = (
  rect: TableRect,
  rowCount: number,
  shrinkBodyHeightBy: number
): StickyContainerRect => {
  const fullHeight = rowCount * DEFAULT_ROW_HEIGHT + shrinkBodyHeightBy;
  const height = Math.min(fullHeight, rect.height);

  return {
    width: rect.width,
    height,
  };
};

export const toTableRect = (rect: stardust.Rect, paginationNeeded: boolean): TableRect => {
  const height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0);

  return {
    width: rect.width,
    height,
  };
};
