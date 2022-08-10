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

export const handleNavigateTop = ({ focusedCellCoord, rootElement, totalsPosition }) => {
  const tableContainer = rootElement.getElementsByClassName('sn-table-container')[0];
  if (!tableContainer.scrollTo) return;

  const [x, y] = focusedCellCoord;
  const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0];
  const rowElements = rootElement.getElementsByClassName('sn-table-row');
  const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];
  const totals = rootElement.getElementsByClassName('sn-table-totals')[0];

  // when totalsPosition is 'top', the table head should include the totals row
  // when totalsPosition is 'bottom' or 'noTotals', the table head should not include the totals row
  const tableHeadHeight =
    totalsPosition === 'top' ? totals.offsetHeight + tableHead.offsetHeight : tableHead.offsetHeight;

  if (cell.offsetTop - tableHeadHeight - cell.offsetHeight <= tableContainer.scrollTop) {
    const targetOffsetTop = tableContainer.scrollTop - tableHeadHeight;
    tableContainer.scrollTo({
      top: Math.max(0, targetOffsetTop),
      behavior: 'instant',
    });
  }
};
