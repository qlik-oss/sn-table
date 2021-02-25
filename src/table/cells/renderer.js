import TableCell from '@material-ui/core/TableCell';
import withSelections from './selections';
import withStyling from './styling';

// column will be needed in the future when column styling is implemented
export default function getCellRenderer(column, selectionsEnabled) {
  // the column in the analysis mode and can be selected
  let cell = TableCell;
  if (selectionsEnabled) {
    cell = withSelections(TableCell);
  }
  if (column.stylingInfo.length) {
    cell = withStyling(cell);
  }

  // the column in the edit mode
  return cell;
}
