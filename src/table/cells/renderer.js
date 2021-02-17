/* eslint-disable import/prefer-default-export */
import TableCell from '@material-ui/core/TableCell';

import { withSelections } from './selections';
// import withIcon from './icon';

// column will be needed in the future when column styling is implemented
export function getCellRenderer(column, selectionsEnabled) {
  // the column in the analysis mode
  if (selectionsEnabled) {
    return withSelections(TableCell);
  }

  // the old column in the edit mode
  return TableCell;
}
