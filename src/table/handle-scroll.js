const handleScroll = (evt, tableSection) => {
  evt.stopPropagation();
  let { scrollLeft } = tableSection.current;
  const newScrollLeft = scrollLeft + evt.deltaX;
  const max = tableSection.current.scrollWidth - tableSection.current.offsetWidth;
  if (max > 0 && (newScrollLeft < 0 || newScrollLeft > max)) {
    evt.preventDefault();
    scrollLeft = Math.max(0, Math.min(max, newScrollLeft));
  }
};

export default handleScroll;
