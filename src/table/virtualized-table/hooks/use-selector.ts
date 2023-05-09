import { Cell } from '../../../types';
import { SelectionStates } from '../../constants';
import { TableContext, useContextSelector } from '../../context';
import { getSelectionMouseHandlers } from '../../utils/handle-mouse';
import { getCellSelectionState } from '../../utils/selections-utils';

const NOOP_ANNOUNCE = () => {};

const onMouseDown = (e: React.MouseEvent<HTMLTableCellElement>) => e.preventDefault();

export default function useSelector(datum: Cell | string) {
  const { constraints } = useContextSelector(TableContext, (value) => value.baseProps);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
  const hasData = typeof datum === 'object';
  const cellSelectionState = useContextSelector(TableContext, (value) =>
    hasData ? getCellSelectionState(datum as Cell, value.selectionState) : SelectionStates.INACTIVE
  );

  const isSelectionsEnabled = !constraints.active && !constraints.select;

  if (hasData && isSelectionsEnabled) {
    const { handleMouseDown, handleMouseOver, handleMouseUp } = getSelectionMouseHandlers(
      onMouseDown,
      datum as Cell,
      selectionDispatch,
      NOOP_ANNOUNCE
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
