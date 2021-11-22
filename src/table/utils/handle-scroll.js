export const handleScroll = (evt, tableSectionRef) => {
  evt.stopPropagation();
  let { scrollLeft } = tableSectionRef.current;
  const newScrollLeft = scrollLeft + evt.deltaX;
  const max = tableSectionRef.current.scrollWidth - tableSectionRef.current.offsetWidth;
  if (max > 0 && (newScrollLeft < 0 || newScrollLeft > max)) {
    evt.preventDefault();
    scrollLeft = Math.max(0, Math.min(max, newScrollLeft));
  }
};

export const handleNavigateTop = ({ tableSectionRef, focusedCellCoord, rootElement }) => {
  const MIN_ROW_COUNT = 2;

  if (!tableSectionRef.current?.scrollTo) return;

  if (focusedCellCoord[0] < MIN_ROW_COUNT) {
    tableSectionRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    const [x, y] = focusedCellCoord;
    const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0];
    const rowElements = rootElement.getElementsByClassName('sn-table-row');
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y];

    if (cell.offsetTop - tableHead.offsetHeight - cell.offsetHeight <= tableSectionRef.current.scrollTop) {
      const targetOffsetTop = tableSectionRef.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      tableSectionRef.current.scrollTo({
        top: Math.max(0, targetOffsetTop),
        behavior: 'smooth',
      });
    }
  }
};
