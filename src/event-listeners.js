export default function addEventListeners(el, selectionsAPI) {
  let isScrollbarDown = false;

  const onMouseDown = (e) => {
    // only true when pressing the scrollbar
    isScrollbarDown = e.offsetX > e.target.clientWidth;
  };

  const onMouseUp = (e) => {
    const classes = e.target.className;
    const isSelectableCell = classes.includes?.('selected') || classes.includes?.('possible');
    if (selectionsAPI.isActive() && !isSelectableCell && !isScrollbarDown) {
      e.stopPropagation();
      selectionsAPI.confirm();
    }
    isScrollbarDown = false;
  };

  el.addEventListener('mousedown', onMouseDown, true);
  el.addEventListener('mouseup', onMouseUp, true);

  return () => {
    el.removeEventListener('mousedown', onMouseDown, true);
    el.removeEventListener('mouseup', onMouseUp, true);
  };
}
