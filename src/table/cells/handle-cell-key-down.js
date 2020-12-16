export function navigation(e, rootElement, row, col) {
  e.stopPropagation();
  e.preventDefault();

  let newRow = row;
  let newCol = col;
  const tableEl = rootElement.getElementsByClassName('sn-table')[0];
  const rows = tableEl.getElementsByClassName('sn-table-row');
  const height = rows.length - 1;
  const width = rows[0].getElementsByClassName('sn-table-cell').length - 1;

  switch (e.key) {
    case 'ArrowDown':
      if (row < height) {
        newRow++;
      }
      break;
    case 'ArrowUp':
      if (row > 0) {
        newRow--;
      }
      break;
    case 'ArrowRight':
      if (col < width) {
        newCol++;
      }
      break;
    case 'ArrowLeft':
      if (col > 0) {
        newCol--;
      }
      break;
    default:
      return;
  }

  e.target.blur();
  e.target.setAttribute('tabIndex', '-1');

  const newCell = rows[newRow].getElementsByClassName('sn-table-cell')[newCol];
  newCell.focus();
  newCell.setAttribute('tabIndex', '0');
}

export default function handleCellKeyDown(e, rootElement, row, col) {
  switch (e.key) {
    // TODO page up/down etc
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowLeft':
      navigation(e, rootElement, row, col);
      break;
    // TODO handle selections, search?, sorting...
    default:
      break;
  }
}
