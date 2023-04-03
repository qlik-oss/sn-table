import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import HeadCellMenu from './HeadCellMenu';
import { areTabStopsEnabled } from '../../utils/accessibility-utils';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, StyledHeadCellIconWrapper } from './styles';

function HeadCellContent({ children, column, isActive, isInteractionEnabled }: HeadCellContentProps) {
  const { keyboard, translator, changeSortOrder } = useContextSelector(TableContext, (value) => value.baseProps);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = isInteractionEnabled && areTabStopsEnabled(keyboard) ? 0 : -1;

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);

  return (
    <StyledHeadCellContent isLocked={Boolean(lockIcon)} className={`aligned-${column.headTextAlign}`}>
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
