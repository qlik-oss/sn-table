import React, { useRef } from "react";

import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu";
import { SortDirection } from "../../../types";
import { TableContext, useContextSelector } from "../../context";
import { HeadCellContentProps } from "../../types";
import { areTabStopsEnabled, setFocusOnClosetColumnAdjuster } from "../../utils/accessibility-utils";
import getHeadIcons from "../../utils/get-head-icons";
import { handleHeadCellMenuKeyDown } from "../../utils/handle-keyboard";
import OldHeadCellMenu from "./HeadCellMenu";
import {
  AbsolutelyStyledRefAnchor,
  StyledHeadCellContent,
  StyledHeadCellIconWrapper,
  StyledSortButton,
  VisuallyHidden,
} from "./styles";

const HeadCellContent = ({ children, column, isInteractionEnabled, open, setOpen }: HeadCellContentProps) => {
  const { keyboard, translator, changeSortOrder, interactions, embed, app, model } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled
  );

  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const { startIcon, endIcon, lockIcon } = getHeadIcons(column);
  const tabIndex = isInteractionEnabled && areTabStopsEnabled(keyboard) ? 0 : -1;

  const handleSort = () => isInteractionEnabled && changeSortOrder(column);

  const sortDirection = {
    A: translator.get("SNTable.Accessibility.Ascending"),
    D: translator.get("SNTable.Accessibility.Descending"),
  };

  const sortFromMenu = (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    return changeSortOrder(column, newSortDirection);
  };

  return (
    <StyledHeadCellContent
      isLocked={Boolean(lockIcon)}
      className={`aligned-${column.headTextAlign}`}
      isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
    >
      {lockIcon && <StyledHeadCellIconWrapper>{lockIcon}</StyledHeadCellIconWrapper>}

      <StyledSortButton
        className="sn-table-head-label"
        isActivelySorted={column.isActivelySorted}
        textAlign={column.headTextAlign}
        color="inherit"
        size="small"
        startIcon={startIcon}
        endIcon={endIcon}
        tabIndex={isNewHeadCellMenuEnabled ? -1 : tabIndex}
        disabled={!isInteractionEnabled}
        onClick={!isNewHeadCellMenuEnabled ? handleSort : () => {}}
        isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
      >
        {children}
        {isFocusInHead && (
          <VisuallyHidden data-testid={`VHL-for-col-${column.pageColIdx}`}>
            {`${sortDirection[column.sortDirection]} ${translator.get("SNTable.SortLabel.PressSpaceToSort")}`}
          </VisuallyHidden>
        )}
      </StyledSortButton>

      {isInteractionEnabled &&
        (isNewHeadCellMenuEnabled ? (
          <>
            <HeadCellMenu
              headerData={column}
              translator={translator}
              tabIndex={-1}
              anchorRef={anchorRef}
              handleHeadCellMenuKeyDown={handleHeadCellMenuKeyDown}
              menuAvailabilityFlags={{
                [MenuAvailabilityFlags.SORTING]: true,
                [MenuAvailabilityFlags.SEARCHING]: true,
                [MenuAvailabilityFlags.SELECTIONS]: true,
                [MenuAvailabilityFlags.ADJUST_HEADER_SIZE]: true,
              }}
              open={open}
              setOpen={setOpen}
              interactions={interactions}
              sortRelatedArgs={{ sortFromMenu }}
              searchRelatedArgs={{ embed, listboxRef }}
              selectionRelatedArgs={{ app, model }}
              adjustHeaderSizeRelatedArgs={{ setFocusOnClosetHeaderAdjuster: setFocusOnClosetColumnAdjuster }}
              shouldShowMenuIcon
            />
            <AbsolutelyStyledRefAnchor ref={listboxRef} />
            <AbsolutelyStyledRefAnchor ref={anchorRef} />
          </>
        ) : (
          <OldHeadCellMenu column={column} tabIndex={tabIndex} />
        ))}
    </StyledHeadCellContent>
  );
};

export default HeadCellContent;
