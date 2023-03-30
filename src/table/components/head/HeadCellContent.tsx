import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import HeadCellMenu from './HeadCellMenu';
import { handleHeadKeyDown } from '../../utils/handle-keyboard';
import { areTabStopsEnabled } from '../../utils/accessibility-utils';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, StyledHeadCellIconWrapper } from './styles';
import { handleMouseDownToFocusHead } from '../../utils/handle-click';

function HeadCellContent({ children, column, isActive }: HeadCellContentProps) {
  const { constraints, keyboard, translator, rootElement, changeSortOrder } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const isInSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI.isModal());

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const isInteractionEnabled = !constraints.active && !isInSelectionMode;
  const tabIndex = isInteractionEnabled && areTabStopsEnabled(keyboard) ? 0 : -1;

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);
  const handleKeyDown = (evt: React.KeyboardEvent) =>
    handleHeadKeyDown({
      evt,
      rootElement,
      cellCoord: [0, column.pageColIdx],
      setFocusedCellCoord,
      isInteractionEnabled,
    });
  const handleMouseDown = () =>
    handleMouseDownToFocusHead([0, column.pageColIdx], rootElement, setFocusedCellCoord, keyboard);

  return (
    <StyledHeadCellContent
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      isLocked={Boolean(lockIcon)}
      className={`aligned-${column.headTextAlign}`}
    >
      {lockIcon && <StyledHeadCellIconWrapper>{lockIcon}</StyledHeadCellIconWrapper>}

      <StyledSortButton
        className="sn-table-head-label"
        isActive={isActive}
        textAlign={column.headTextAlign}
        color="inherit"
        size="small"
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={handleSort}
        tabIndex={tabIndex}
        disabled={!isInteractionEnabled}
      >
        {children}
        {isFocusInHead && (
          <VisuallyHidden data-testid={`VHL-for-col-${column.pageColIdx}`}>
            {`${FullSortDirection[column.sortDirection]} ${translator.get('SNTable.SortLabel.PressSpaceToSort')}`}
          </VisuallyHidden>
        )}
      </StyledSortButton>

      {isInteractionEnabled && <HeadCellMenu column={column} tabIndex={tabIndex} />}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
