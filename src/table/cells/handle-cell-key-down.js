export default function handleCellKeyDown(e, row, col) {
  e.stopPropagation();
  e.preventDefault();

  let newRow = row;
  let newCol = col;
  const tableEl = e.target.parentElement.parentElement;

  switch (e.key) {
    case 'ArrowDown':
      if (row < 99) { // 100 rows
        console.log('down');
        newRow++;
      }
      break;
    case 'ArrowUp':
      if (row > 0) {
        console.log('up');
        newRow--;
      }
      break;
    case 'ArrowRight':
      if (col < 3) { // 100 rows
        console.log('right');
        newCol++;
      }
      break;
    case 'ArrowLeft':
      if (col > 0) {
        console.log('left');
        newCol--;
      }
      break;
    default:
      break;
  }

  e.target.blur();
  e.target.setAttribute('tabIndex', '-1');
  const newCell = tableEl.children[newRow].children[newCol];
  console.log(row, col, newRow, newCol);

  newCell.focus();
  newCell.setAttribute('tabIndex', '0');

  /* TODO
  - handle enter/space for selections
  */
}
