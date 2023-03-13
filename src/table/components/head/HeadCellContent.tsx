import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent } from './styles';
import HeadCellMenu from './HeadCellMenu';
import { handleHeadKeyDown } from '../../utils/handle-keyboard';

function HeadCellContent({ children, column, isActive, areBasicFeaturesEnabled }: HeadCellContentProps) {
  const { constraints, keyboard, translator, rootElement, changeSortOrder } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const isInSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI.isModal());

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const isInteractionEnabled = !constraints.active && !isInSelectionMode;
  const tabIndex = isInteractionEnabled && !keyboard.enabled ? 0 : -1;

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);
  const onKeyDown = (evt: React.KeyboardEvent) =>
    handleHeadKeyDown({
      evt,
      rootElement,
      cellCoord: [0, column.pageColIdx],
      setFocusedCellCoord,
      isInteractionEnabled,
      areBasicFeaturesEnabled,
    });

  return (
    <StyledHeadCellContent onKeyDown={onKeyDown}>
      {lockIcon}

      <StyledSortButton
        className="sn-table-head-label"
        isActive={isActive}
        textAlign={column.headCellTextAlign}
        title={!constraints.passive ? FullSortDirection[column.sortDirection] : undefined} // passive: turn off tooltips.
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
            {translator.get('SNTable.SortLabel.PressSpaceToSort')}
          </VisuallyHidden>
        )}
      </StyledSortButton>

      {areBasicFeaturesEnabled && isInteractionEnabled && <HeadCellMenu column={column} tabIndex={tabIndex} />}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
