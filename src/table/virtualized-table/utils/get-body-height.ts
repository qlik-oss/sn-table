import { Rect } from "../types";

const getBodyHeight = (
  rect: Rect,
  headerAndTotalsHeight: number,
  deferredRowCount: number,
  estimatedRowHeight: number
) => {
  let { height: bodyHeight } = rect;
  bodyHeight -= headerAndTotalsHeight;
  if (deferredRowCount * estimatedRowHeight < bodyHeight) {
    bodyHeight = Math.min(deferredRowCount * estimatedRowHeight, bodyHeight);
  }

  return bodyHeight;
};

export default getBodyHeight;
