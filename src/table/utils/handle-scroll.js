export const handleHorizontalScroll = (evt, isRTL, memoedContainer) => {
  if (evt.deltaX === 0) return;

  evt.stopPropagation();
  // scrollWidth is the width of an element's content, including content not visible on the screen due to overflow.
  // offsetWidth is the element's CSS width, including any borders, padding, and vertical scrollbars
  const maxScrollableWidth = memoedContainer.scrollWidth - memoedContainer.offsetWidth;

  // scrollLeft is the number of pixels scrolled from its left edge
  // scrollLeft is 0 when the scrollbar is at its leftmost position
  // (at the start of the scrolled content),
  // and then increasingly negative as it is scrolled towards left.
  let { scrollLeft } = memoedContainer;

  // evt.deltaX is the horizontal scroll amount
  // evt.deltaX increasingly negative as you scroll towards left,
  // increasingly positive as you scroll towards right
  let scrolledDistance = scrollLeft + evt.deltaX;

  if (isRTL) scrolledDistance = maxScrollableWidth + scrolledDistance;
  if (maxScrollableWidth > 0 && (scrolledDistance < 0 || scrolledDistance > maxScrollableWidth + 1)) {
    evt.preventDefault();
    scrollLeft = isRTL
      ? Math.min(0, Math.min(maxScrollableWidth, scrolledDistance))
      : Math.max(0, Math.min(maxScrollableWidth, scrolledDistance));
  }
};

export const handleNavigateTop = (cellCoord, rootElement) => {
  const tableContainer = rootElement.getElementsByClassName('sn-table-container')[0];
  if (!tableContainer?.scrollTo) return;

  const [x, y] = cellCoord;
  const MIN_ROW_COUNT = 2;
  if (x < MIN_ROW_COUNT) {
    tableContainer.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  } else {
    const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0];
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

    if (cell.offsetTop - tableHead.offsetHeight < tableContainer.scrollTop) {
      const targetOffsetTop = tableContainer.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      tableContainer.scrollTo({
        top: Math.max(0, targetOffsetTop),
        behavior: 'instant',
      });
    }
  }
};
