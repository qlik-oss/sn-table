import { Cell } from '../../../../types';
import { SelectionStates } from '../../../constants';
import { TableContext, useContextSelector } from '../../../context';
import { CellStyle } from '../../../types';
import { getSelectionMouseHandlers } from '../../../utils/handle-click';
import { getCellSelectionState } from '../../../utils/selections-utils';
import { getSelectionStyle } from '../../../utils/styling-utils';

const NOOP_ANNOUNCE = () => {};

const onMouseDown = (e: React.MouseEvent<HTMLTableCellElement>) => e.preventDefault();

export default function useSelector(datum: Cell | string, cellStyle: CellStyle) {
  const hasData = typeof datum === 'object';

  const cellSelectionState = useContextSelector(TableContext, (value) =>
    hasData ? getCellSelectionState(datum as Cell, value.selectionState) : SelectionStates.INACTIVE
  );

  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

  if (hasData) {
    const { handleMouseDown, handleMouseOver, handleMouseUp } = getSelectionMouseHandlers(
      datum as Cell,
      NOOP_ANNOUNCE,
      onMouseDown,
      selectionDispatch,
      true
    );

    const selectionStyling = getSelectionStyle(cellStyle, cellSelectionState);

    return {
      handleMouseDown,
      handleMouseOver,
      handleMouseUp,
      selectionStyling,
    };
  }

  return {};
}
