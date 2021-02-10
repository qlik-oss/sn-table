import TableCell from '@material-ui/core/TableCell';

import { withSelections } from './selections';
// import withIcon from './icon';

// column will be needed in the future when column styling is implemented
export default function getCellRenderer(column, selectionsEnabled) {
  if (selectionsEnabled) {
    return withSelections(TableCell);
  }

  return TableCell;
}
