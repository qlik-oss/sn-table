import TableCell from '@mui/material/TableCell';
import withColumnStyling from './withColumnStyling';
import withSelections from './withSelections';
import withStyling from './withStyling';

export default function getCellRenderer(hasColumnStyling, selectionsEnabled) {
  // withStyling always runs last, applying whatever styling it gets
  let cell = withStyling(TableCell);

  if (selectionsEnabled) {
    cell = withSelections(cell);
  }
  if (hasColumnStyling) {
    cell = withColumnStyling(cell);
  }

  return cell;
}
