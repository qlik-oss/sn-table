import React from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent } from './styles';
import HeadCellMenu from './HeadCellMenu';
import CellText from '../CellText';
import CellTextWrapper from '../CellTextWrapper';

function HeadCellContent({ column, columnIndex, isActive, areBasicFeaturesEnabled }: HeadCellContentProps) {
  const { constraints, selectionsAPI, keyboard, translator, changeSortOrder } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = !keyboard.enabled ? 0 : -1;
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);

  return (
    <StyledHeadCellContent>
      {lockIcon}
      <StyledSortButton
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
        <CellTextWrapper>
          <CellText>{column.label}</CellText>
        </CellTextWrapper>
        {isFocusInHead && (
          <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
            {translator.get('SNTable.SortLabel.PressSpaceToSort')}
          </VisuallyHidden>
        )}
      </StyledSortButton>
      {areBasicFeaturesEnabled && (
        <HeadCellMenu columnIndex={columnIndex} isDimension={column.isDim} tabIndex={tabIndex} />
      )}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
