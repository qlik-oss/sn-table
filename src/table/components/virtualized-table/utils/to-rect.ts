import { stardust } from '@nebula.js/stardust';
import { BORDER_WIDTH, DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from '../constants';
import { StickyContainerRect, TableRect } from '../types';

export const toStickyContainerRect = (
  rect: TableRect,
  rowCount: number,
  shrinkBodyHeightBy: number
): StickyContainerRect => {
  const fullHeight = rowCount * DEFAULT_ROW_HEIGHT + shrinkBodyHeightBy;
  const heightAdjustedForBorderWidth = rect.height - BORDER_WIDTH * 2;
  const height = Math.min(fullHeight, heightAdjustedForBorderWidth);

  return {
    width: rect.width - BORDER_WIDTH * 2,
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
