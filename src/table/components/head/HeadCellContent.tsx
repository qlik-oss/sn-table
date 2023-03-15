import React, { useMemo } from 'react';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellContentProps } from '../../types';
import { FullSortDirection } from '../../constants';
import getHeadIcons from '../../utils/get-head-icons';
import HeadCellMenu from './HeadCellMenu';
import { handleHeadKeyDown } from '../../utils/handle-keyboard';
import { areTabStopsEnabled } from '../../utils/accessibility-utils';
import { VisuallyHidden, StyledSortButton, StyledHeadCellContent, StyledHeadCellIconWrapper } from './styles';

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
  const tabIndex = isInteractionEnabled && areTabStopsEnabled(keyboard) ? 0 : -1;

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

  const headCellContentClassName = useMemo(() => {
    let className = '';
    if (!column.isDim || column.headCellTextAlign === 'right') className += 'reverse ';
    if (column.headCellTextAlign === 'center') className += 'centered';
    return className;
  }, [column]);

  return (
    <StyledHeadCellContent onKeyDown={onKeyDown} isLocked={lockIcon} className={headCellContentClassName}>
      {(lockIcon || column.headCellTextAlign === 'center') && (
        <StyledHeadCellIconWrapper>{lockIcon}</StyledHeadCellIconWrapper>
      )}

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

      <StyledHeadCellIconWrapper>
        {areBasicFeaturesEnabled && isInteractionEnabled && <HeadCellMenu column={column} tabIndex={tabIndex} />}
      </StyledHeadCellIconWrapper>
    </StyledHeadCellContent>
  );
}

export default HeadCellContent;
