const handleScroll = (evt, tableSection) => {
  evt.stopPropagation();
  const max = tableSection.current.scrollWidth - tableSection.current.offsetWidth;
  if (
    max > 0 &&
    (tableSection.current.scrollLeft + evt.deltaX < 0 || tableSection.current.scrollLeft + evt.deltaX > max)
  ) {
    evt.preventDefault();
    tableSection.current.scrollLeft = Math.max(0, Math.min(max, tableSection.current.scrollLeft + evt.deltaX));
  }
};

export default handleScroll;
