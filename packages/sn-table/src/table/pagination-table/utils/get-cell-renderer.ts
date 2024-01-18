import { StyledBodyCell } from "../components/body/styles";
import withColumnStyling from "../components/body/withColumnStyling";
import withSelections from "../components/body/withSelections";
import withStyling from "../components/body/withStyling";

export default function getCellRenderer(hasColumnStyling: boolean, isSelectionsEnabled: boolean) {
  // withStyling always runs last, applying whatever styling it gets
  let cell = withStyling(StyledBodyCell);
  if (isSelectionsEnabled) cell = withSelections(cell);
  if (hasColumnStyling) cell = withColumnStyling(cell);
  return cell;
}
