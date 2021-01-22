import TableCell from '@material-ui/core/TableCell';

import withSelections from './selections';
import withIcon from './icon';

export default function getCellRenderer(column, selectionsEnabled) {
  if (column.isDim) {
    if (selectionsEnabled) {
      return withSelections(withIcon(TableCell));
    }

    return withIcon(TableCell);
  }
  return null;
}
