import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import useHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, LockAndLabel } from './styles';
import HeadCellMenu from './HeadCellMenu';

function HeadCellContent({
  column,
  columnIndex,
  changeSortOrder,
  isActive,
  areBasicFeaturesEnabled,
}: HeadCellContentProps) {
  const { constraints, selectionsAPI, keyboard, translator } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = useHeadIcons(column);
  const tabIndex = !keyboard.enabled ? 0 : -1;
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);

  return (
    <StyledHeadCellContent>
      <LockAndLabel>
        {lockIcon}
        <StyledSortButton
          isActive={isActive}
          title={!constraints.passive ? FullSortDirection[column.sortDirection] : undefined} // passive: turn off tooltips.
          color="inherit"
          size="small"
          startIcon={startIcon}
          endIcon={endIcon}
          onClick={handleSort}
          tabIndex={tabIndex}
        >
          {column.label}
          {isFocusInHead && (
            <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
              {translator.get('SNTable.SortLabel.PressSpaceToSort')}
            </VisuallyHidden>
          )}
        </StyledSortButton>
      </LockAndLabel>
      {areBasicFeaturesEnabled && (
        <HeadCellMenu columnIndex={columnIndex} isDimension={column.isDim} tabIndex={tabIndex} />
      )}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
