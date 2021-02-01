import TableCell from '@material-ui/core/TableCell';

import withSelections from './selections';
import withIcon from './icon';

export default function getCellRenderer(column) {
  if (column.isDim) {
    return withSelections(withIcon(TableCell));
  }

  return withSelections(TableCell);
}
