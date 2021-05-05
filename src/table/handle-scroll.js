const handleScroll = (evt, tableSection) => {
  evt.stopPropagation();
  let { scrollLeft } = tableSection.current;
  const { deltaX } = evt;
  const max = tableSection.current.scrollWidth - tableSection.current.offsetWidth;
  if (max > 0 && (scrollLeft + deltaX < 0 || scrollLeft + deltaX > max)) {
    evt.preventDefault();
    scrollLeft = Math.max(0, Math.min(max, scrollLeft + deltaX));
  }
};

export default handleScroll;
