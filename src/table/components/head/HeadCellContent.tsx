import React from 'react';

import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import useHeadIcons from '../../hooks/use-head-icons';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, LockAndLabel } from './styles';
import HeadCellMenu from './HeadCellMenu';

function HeadCellContent({
  column,
  columnIndex,
  isFocusInHead,
  layout,
  constraints,
  translator,
  embed,
  areBasicFeaturesEnabled,
  isInteractionEnabled,
  changeSortOrder,
  tabIndex,
}: HeadCellContentProps) {
  const { startIcon, endIcon, lockIcon } = useHeadIcons(column);
  const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
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
        <HeadCellMenu
          translator={translator}
          embed={embed}
          layout={layout}
          columnIndex={columnIndex}
          isDimension={column.isDim}
          tabIndex={tabIndex}
        />
      )}
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
