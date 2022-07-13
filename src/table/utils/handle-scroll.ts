export const handleHorizontalScroll = (evt: WheelEvent, isRTL: boolean, memoedContainer: HTMLDivElement) => {
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

interface IHandleNavigateTopProps {
  tableContainerRef: React.MutableRefObject<HTMLDivElement>;
  focusedCellCoord: [number, number];
  rootElement: Element;
}

export const handleNavigateTop = ({ tableContainerRef, focusedCellCoord, rootElement }: IHandleNavigateTopProps) => {
  const MIN_ROW_COUNT = 2;

  if (!tableContainerRef.current?.scrollTo) return;

  if (focusedCellCoord[0] < MIN_ROW_COUNT) {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    const [x, y] = focusedCellCoord;
    const tableHead = rootElement.getElementsByClassName('sn-table-head-cell')[0] as HTMLTableCellElement;
    const rowElements = rootElement.getElementsByClassName('sn-table-row') as HTMLCollectionOf<HTMLTableRowElement>;
    const cell = rowElements[x]?.getElementsByClassName('sn-table-cell')[y] as HTMLTableCellElement;

    if (cell.offsetTop - tableHead.offsetHeight - cell.offsetHeight <= tableContainerRef.current.scrollTop) {
      const targetOffsetTop = tableContainerRef.current.scrollTop - cell.offsetHeight - tableHead.offsetHeight;
      tableContainerRef.current.scrollTo({
        top: Math.max(0, targetOffsetTop),
        behavior: 'smooth',
      });
    }
  }
};
