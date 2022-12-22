import { stardust } from '@nebula.js/stardust';
import { BORDER_WIDTH, DEFAULT_ROW_HEIGHT, PAGINATION_HEIGHT } from '../constants';

export const toStickyContainerRect = (rect: stardust.Rect, rowCount: number, shrinkBodyHeightBy: number) => {
  const fullHeight = rowCount * DEFAULT_ROW_HEIGHT + shrinkBodyHeightBy;
  const heightAdjustedForBorderWidth = rect.height - BORDER_WIDTH * 2;
  const height = Math.min(fullHeight, heightAdjustedForBorderWidth);

  return {
    ...rect,
    width: rect.width - BORDER_WIDTH * 2,
    height,
  };
};

export const toTableRect = (rect: stardust.Rect, paginationNeeded: boolean) => {
  const height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0);

  return {
    ...rect,
    height,
  };
};
