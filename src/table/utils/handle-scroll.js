export const handleHorizontalScroll = (evt, rtl, memoedContainer) => {
  evt.stopPropagation();
  // scrollWidth is the width of an element's content, including content not visible on the screen due to overflow.
  // offsetWidth is the element's CSS width, including any borders, padding, and vertical scrollbars
  // scrollLeft is the number of pixels scrolled from its left edge
  let { scrollLeft } = memoedContainer;
  const ScrollLeftWidth = scrollLeft + evt.deltaX;
  const maxScrollableWidth = memoedContainer.scrollWidth - memoedContainer.offsetWidth;
  if (rtl) {
    // scrollLeft is 0 when the scrollbar is at its rightmost position
    // (at the start of the scrolled content),
    // and then increasingly negative as you scroll towards (left) the end of the content .
    // evt.deltaX increasingly negative as you scroll towards left,
    // increasingly positive as you scroll towards right
    const scrollRight = maxScrollableWidth + ScrollLeftWidth;
    if (maxScrollableWidth > 0 && (scrollRight <= 0 || scrollRight > maxScrollableWidth)) {
      evt.preventDefault();
      scrollLeft = Math.min(0, Math.min(maxScrollableWidth, scrollRight));
    }
  } else if (maxScrollableWidth > 0 && (ScrollLeftWidth < 0 || ScrollLeftWidth > maxScrollableWidth)) {
    evt.preventDefault();
    scrollLeft = Math.max(0, Math.min(maxScrollableWidth, ScrollLeftWidth));
  }
};

export const handleNavigateTop = ({ tableContainerRef, focusedCellCoord, rootElement }) => {
  const MIN_ROW_COUNT = 2;

  if (!tableContainerRef.current?.scrollTo) return;

  if (focusedCellCoord[0] < MIN_ROW_COUNT) {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    const [x, y] = focusedCellCoord;
    const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0];
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

    if (cell.offsetTop - tableHead.offsetHeight - cell.offsetHeight <= tableContainerRef.current.scrollTop) {
      const targetOffsetTop = tableContainerRef.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      tableContainerRef.current.scrollTo({
        top: Math.max(0, targetOffsetTop),
        behavior: 'smooth',
      });
    }
  }
};
