import { Cell } from '../../../types';
import { SelectionStates } from '../../constants';
import { TableContext, useContextSelector } from '../../context';
import { getSelectionMouseHandlers } from '../../utils/handle-click';
import { getCellSelectionState } from '../../utils/selections-utils';

const NOOP_ANNOUNCE = () => {};

const onMouseDown = (e: React.MouseEvent<HTMLTableCellElement>) => e.preventDefault();

export default function useSelector(datum: Cell | string) {
  const hasData = typeof datum === 'object';

  const cellSelectionState = useContextSelector(TableContext, (value) =>
    hasData ? getCellSelectionState(datum as Cell, value.selectionState) : SelectionStates.INACTIVE
  );

  const { constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const isSelectionsEnabled = !constraints.active && !constraints.select;

  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);

  if (hasData && isSelectionsEnabled) {
    const { handleMouseDown, handleMouseOver, handleMouseUp } = getSelectionMouseHandlers(
      datum as Cell,
      NOOP_ANNOUNCE,
      onMouseDown,
      selectionDispatch,
      true
    );

    return {
      handleMouseDown,
      handleMouseOver,
      handleMouseUp,
      cellSelectionState,
    };
  }

  return { cellSelectionState };
}
