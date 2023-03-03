import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent } from './styles';
import HeadCellMenu from './HeadCellMenu';

function HeadCellContent({ children, column, isActive, areBasicFeaturesEnabled }: HeadCellContentProps) {
  const { constraints, selectionsAPI, keyboard, translator, changeSortOrder } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = !keyboard.enabled ? 0 : -1;
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  return (
    <StyledHeadCellContent>
      {lockIcon}
      {isInteractionEnabled ? (
        <StyledSortButton
          isActive={isActive}
          textAlign={column.align}
          title={!constraints.passive ? FullSortDirection[column.sortDirection] : undefined} // passive: turn off tooltips.
          color="inherit"
          size="small"
          startIcon={startIcon}
          endIcon={endIcon}
          onClick={() => changeSortOrder(column)}
          tabIndex={tabIndex}
        >
          {children}
          {isFocusInHead && (
            <VisuallyHidden data-testid={`VHL-for-col-${column.pageColIdx}`}>
              {translator.get('SNTable.SortLabel.PressSpaceToSort')}
            </VisuallyHidden>
          )}
        </StyledSortButton>
      ) : (
        <>
          {children}
          {isFocusInHead && (
            <VisuallyHidden data-testid={`VHL-for-col-${column.pageColIdx}`}>
              {translator.get('SNTable.SortLabel.PressSpaceToSort')}
            </VisuallyHidden>
          )}
        </>
      )}
      {areBasicFeaturesEnabled && isInteractionEnabled && <HeadCellMenu column={column} tabIndex={tabIndex} />}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
