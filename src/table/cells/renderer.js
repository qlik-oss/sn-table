import TableCell from '@material-ui/core/TableCell';
import withSelections from './selections';
import withoutSelections from './withoutSelections';

// column will be needed in the future when column styling is implemented
export default function getCellRenderer(column, selectionsEnabled) {
  // the column in the analysis mode and can be selected
  if (selectionsEnabled) return withSelections(TableCell);

  // the column in the edit mode
  return withoutSelections(TableCell);
}
