import { stardust } from "@nebula.js/stardust";
import { PAGINATION_HEIGHT } from "@qlik/nebula-table-utils/lib/constants";
import { Rect } from "../types";

const BORDER_WIDTH = 1;

const toTableRect = (rect: stardust.Rect, paginationNeeded: boolean): Rect => {
  const height = rect.height - (paginationNeeded ? PAGINATION_HEIGHT + BORDER_WIDTH : 0);

  return {
    width: rect.width,
    height,
  };
};

export const toStickyContainerRect = (rect: Rect, xScrollbarWidth: number, yScrollbarWidth: number) => ({
  width: rect.width - yScrollbarWidth,
  height: rect.height - xScrollbarWidth,
});

export default toTableRect;
