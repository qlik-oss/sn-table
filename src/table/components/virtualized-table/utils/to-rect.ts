import { stardust } from '@nebula.js/stardust';
import { PAGINATION_HEIGHT } from '../constants';
import { Rect } from '../types';

const toTableRect = (rect: stardust.Rect, paginationNeeded: boolean): Rect => {
  const height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT : 0);

  return {
    width: rect.width,
    height,
  };
};

export default toTableRect;
