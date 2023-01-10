import { stardust } from '@nebula.js/stardust';
import { DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from '../constants';
import { Rect } from '../types';

export const toStickyContainerRect = (rect: Rect, rowCount: number, shrinkBodyHeightBy: number): Rect => {
  const fullHeight = rowCount * DEFAULT_ROW_HEIGHT + shrinkBodyHeightBy;
  const height = Math.min(fullHeight, rect.height);

  return {
    width: rect.width,
    height,
  };
};

export const toTableRect = (rect: stardust.Rect, paginationNeeded: boolean): Rect => {
  const height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0);

  return {
    width: rect.width,
    height,
  };
};
