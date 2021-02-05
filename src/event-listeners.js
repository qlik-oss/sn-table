export default function addEventListeners(el, selectionsAPI) {
  let scrollbarDown = false;

  const onMouseDown = (e) => {
    scrollbarDown = e.offsetX > e.target.clientWidth;
  };

  const onMouseUp = (e) => {
    const classes = e.target.className;
    const isSelectableCell = classes.includes?.('selected') || classes.includes?.('possible');
    if (selectionsAPI.isActive() && !isSelectableCell && !scrollbarDown) {
      e.stopPropagation();
      selectionsAPI.confirm();
    }
    scrollbarDown = false;
  };

  el.addEventListener('mousedown', onMouseDown, true);
  el.addEventListener('mouseup', onMouseUp, true);

  return () => {
    el.removeEventListener('mousedown', onMouseDown, true);
    el.removeEventListener('mouseup', onMouseUp, true);
  };
}
