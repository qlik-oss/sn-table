const handleScroll = (evt, tableSectionRef) => {
  evt.stopPropagation();
  let { scrollLeft } = tableSectionRef.current;
  const newScrollLeft = scrollLeft + evt.deltaX;
  const max = tableSectionRef.current.scrollWidth - tableSectionRef.current.offsetWidth;
  if (max > 0 && (newScrollLeft < 0 || newScrollLeft > max)) {
    evt.preventDefault();
    scrollLeft = Math.max(0, Math.min(max, newScrollLeft));
  }
};

export default handleScroll;
