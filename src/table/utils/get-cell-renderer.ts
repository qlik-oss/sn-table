import { StyledBodyCell } from '../styles';
import withColumnStyling from '../components/withColumnStyling';
import withSelections from '../components/withSelections';
import withStyling from '../components/withStyling';

export default function getCellRenderer(hasColumnStyling: boolean, isSelectionsEnabled: boolean) {
  // withStyling always runs last, applying whatever styling it gets
  let cell = withStyling(StyledBodyCell);
  if (isSelectionsEnabled) cell = withSelections(cell);
  if (hasColumnStyling) cell = withColumnStyling(cell);
  return cell;
}
