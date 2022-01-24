export const handleHorizontalScroll = (evt, rtl, memoedContainer) => {
  evt.stopPropagation();
  if (rtl) {
    // in RTL, scrollLeft is actually scrollRight, scrollRight is scrollLeft
    let { scrollLeft } = memoedContainer;
    const newScrollLeft = scrollLeft + evt.deltaX;
    const scrollRight = memoedContainer.scrollWidth + newScrollLeft - memoedContainer.clientWidth;
    const max = memoedContainer.scrollWidth - memoedContainer.offsetWidth;
    if (max > 0 && (scrollRight < 0 || scrollRight > max)) {
      evt.preventDefault();
      scrollLeft = Math.min(0, Math.min(max, scrollRight));
    }
  } else {
    let { scrollLeft } = memoedContainer;
    const newScrollLeft = scrollLeft + evt.deltaX;
    const max = memoedContainer.scrollWidth - memoedContainer.offsetWidth;
    if (max > 0 && (newScrollLeft < 0 || newScrollLeft > max)) {
      evt.preventDefault();
      scrollLeft = Math.max(0, Math.min(max, newScrollLeft));
    }
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
