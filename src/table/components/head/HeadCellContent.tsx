import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, LockAndLabel } from './styles';
import HeadCellMenu from './HeadCellMenu';
import { handleHeadKeyDown } from '../../utils/handle-key-press';

function HeadCellContent({
  column,
  columnIndex,
  changeSortOrder,
  isActive,
  areBasicFeaturesEnabled,
  isLastCell,
}: HeadCellContentProps) {
  const { constraints, selectionsAPI, keyboard, translator, rootElement } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();
  const isLabelLast = column.align === 'right';
  const className = isLastCell && isLabelLast ? 'sn-table-head-last-element' : '';

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);
  const onKeyDown = (evt: React.KeyboardEvent) =>
    handleHeadKeyDown({
      evt,
      rootElement,
      cellCoord: [0, columnIndex],
      setFocusedCellCoord,
      isInteractionEnabled,
      areBasicFeaturesEnabled,
      isLabelLast,
    });

  return (
    <StyledHeadCellContent onKeyDown={onKeyDown} className={className}>
      <LockAndLabel>
        {lockIcon}
        <StyledSortButton
          className="sn-table-head-label"
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
        <HeadCellMenu
          columnIndex={columnIndex}
          isDimension={column.isDim}
          tabIndex={tabIndex}
          isLastElement={isLastCell && !isLabelLast}
        />
      )}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
