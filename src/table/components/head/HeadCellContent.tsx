import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent } from './styles';
import HeadCellMenu from './HeadCellMenu';
import { handleHeadKeyDown } from '../../utils/handle-key-press';

function HeadCellContent({ children, column, isActive, areBasicFeaturesEnabled, isLastColumn }: HeadCellContentProps) {
  const { constraints, selectionsAPI, keyboard, translator, rootElement, changeSortOrder } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();
  const className = isLastColumn ? 'sn-table-head-last-element' : '';

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);
  const onKeyDown = (evt: React.KeyboardEvent) =>
    handleHeadKeyDown({
      evt,
      rootElement,
      cellCoord: [0, column.pageColIdx],
      setFocusedCellCoord,
      isInteractionEnabled,
      areBasicFeaturesEnabled,
      // isLastColumn,
    });

  return (
    <StyledHeadCellContent onKeyDown={onKeyDown} className={className}>
      {lockIcon}

      <StyledSortButton
        className="sn-table-head-label"
        isActive={isActive}
        textAlign={column.align}
        title={!constraints.passive ? FullSortDirection[column.sortDirection] : undefined} // passive: turn off tooltips.
        color="inherit"
        size="small"
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={handleSort}
        tabIndex={tabIndex}
      >
        {children}
        {isFocusInHead && (
          <VisuallyHidden data-testid={`VHL-for-col-${column.pageColIdx}`}>
            {translator.get('SNTable.SortLabel.PressSpaceToSort')}
          </VisuallyHidden>
        )}
      </StyledSortButton>

      {areBasicFeaturesEnabled && <HeadCellMenu column={column} tabIndex={tabIndex} isLastColumn={isLastColumn} />}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
