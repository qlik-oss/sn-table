import ClearSelections from "@qlik-trial/sprout/icons/react/ClearSelections";
import ColumnSize from "@qlik-trial/sprout/icons/react/ColumnSize";
import More from "@qlik-trial/sprout/icons/react/More";
import Search from "@qlik-trial/sprout/icons/react/Search";
import SelectAll from "@qlik-trial/sprout/icons/react/SelectAll";
import SelectAlternative from "@qlik-trial/sprout/icons/react/SelectAlternative";
import SelectExcluded from "@qlik-trial/sprout/icons/react/SelectExcluded";
import SelectPossible from "@qlik-trial/sprout/icons/react/SelectPossible";
import Selection from "@qlik-trial/sprout/icons/react/Selection";
import { preventDefaultBehavior } from "@qlik/nebula-table-utils/lib/utils";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TableLayout } from "../../../types";
import { TableContext, useContextSelector } from "../../context";
import useFieldSelection from "../../hooks/use-field-selection";
import { DEFAULT_FONT_SIZE } from "../../styling-defaults";
import { HeadCellMenuProps, MenuItemGroup } from "../../types";
import { setFocusOnColumnAdjuster } from "../../utils/accessibility-utils";
import RecursiveMenuList from "./MenuList/RecursiveMenuList";
import { HeadCellMenuWrapper, StyledMenuIconButton } from "./styles";

const HeadCellMenu = ({ column, tabIndex }: HeadCellMenuProps) => {
  const { isDim, qLibraryId, fieldId, headTextAlign, pageColIdx } = column;
  const { translator, embed, model, interactions, layout } = useContextSelector(
    TableContext,
    (value) => value.baseProps,
  );
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const {
    fieldInstance,
    selectionActionsEnabledStatus,
    resetSelectionActionsEnabledStatus,
    updateSelectionActionsEnabledStatus,
  } = useFieldSelection(column, openMenuDropdown);
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled,
  );

  const embedListbox = useCallback(() => {
    const id = qLibraryId ? { qLibraryId, type: "dimension" } : fieldId;
    // @ts-expect-error TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.__DO_NOT_USE__.popover(listboxRef.current, id, {
      anchorOrigin: { vertical: "bottom", horizontal: "left" },
      transformOrigin: { vertical: "top", horizontal: "left" },
      stateName: layout.qStateName,
    });

    // @ts-expect-error TODO: no types for popover related api until it becomes stable
    embed.on("fieldPopoverClose", () => {
      setOpenListboxDropdown(false);
    });
  }, [embed, fieldId, qLibraryId, layout.qStateName]);

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      ...(isDim && interactions.select
        ? [
            [
              {
                id: 1,
                itemTitle: translator.get("SNTable.MenuItem.Search"),
                onClick: (evt: React.MouseEvent) => {
                  evt.stopPropagation();
                  setOpenMenuDropdown(false);
                  setOpenListboxDropdown(true);
                  embedListbox();
                },
                icon: <Search />,
                enabled: true,
              },
            ],
            [
              {
                id: 1,
                itemTitle: translator.get("SNTable.MenuItem.Selections"),
                icon: <Selection />,
                enabled: true,
                subMenus: [
                  [
                    {
                      id: 1,
                      itemTitle: translator.get("SNTable.MenuItem.SelectAll"),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectAll();
                      },
                      icon: <SelectAll />,
                      enabled: selectionActionsEnabledStatus.canSelectAll,
                    },
                    {
                      id: 2,
                      itemTitle: translator.get("SNTable.MenuItem.SelectPossible"),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectPossible();
                      },
                      icon: <SelectPossible />,
                      enabled: selectionActionsEnabledStatus.canSelectPossible,
                    },
                    {
                      id: 3,
                      itemTitle: translator.get("SNTable.MenuItem.SelectAlternative"),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectAlternative();
                      },
                      icon: <SelectAlternative />,
                      enabled: selectionActionsEnabledStatus.canSelectAlternative,
                    },
                    {
                      id: 4,
                      itemTitle: translator.get("SNTable.MenuItem.SelectExcluded"),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectExcluded();
                      },
                      icon: <SelectExcluded />,
                      enabled: selectionActionsEnabledStatus.canSelectExcluded,
                    },
                  ],
                  [
                    {
                      id: 1,
                      itemTitle: translator.get("SNTable.MenuItem.ClearSelections"),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.clear();
                      },
                      icon: <ClearSelections />,
                      enabled: selectionActionsEnabledStatus.canClearSelections,
                    },
                  ],
                ],
              },
            ],
          ]
        : []),
      [
        {
          id: 1,
          itemTitle: translator.get("SNTable.MenuItem.AdjustColumnSize"),
          onClick: (evt: React.MouseEvent) => {
            preventDefaultBehavior(evt);
            setOpenMenuDropdown(false);
            setFocusOnColumnAdjuster(anchorRef);
          },
          icon: <ColumnSize />,
          enabled: true,
        },
      ],
    ],
    [isDim, interactions.select, translator, selectionActionsEnabledStatus, embedListbox, fieldInstance],
  );

  const handleOpenDropdown = async () => {
    if (!openMenuDropdown && model) {
      const latestLayout = await model.getLayout();
      updateSelectionActionsEnabledStatus(latestLayout as TableLayout);
    }
    setOpenMenuDropdown(!openMenuDropdown);
  };

  useEffect(() => {
    if (!openMenuDropdown) resetSelectionActionsEnabledStatus();
  }, [openMenuDropdown, resetSelectionActionsEnabledStatus]);

  const chartId = layout.qInfo.qId as string;
  const buttonId = `sn-table-head-menu-button-${pageColIdx}-${chartId}`;
  const menuId = `sn-table-head-menu-${pageColIdx}-${chartId}`;

  return menuItemGroups.length ? (
    <HeadCellMenuWrapper rightAligned={headTextAlign === "right"}>
      <StyledMenuIconButton
        isVisible={openListboxDropdown || openMenuDropdown}
        ref={anchorRef}
        size="small"
        tabIndex={tabIndex}
        className="sn-table-head-menu-button"
        id={buttonId}
        aria-controls={openMenuDropdown ? menuId : undefined}
        aria-expanded={openMenuDropdown ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenDropdown}
        aria-label={translator.get("SNTable.Accessibility.ColumnOptions")}
        isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
      >
        <More height={DEFAULT_FONT_SIZE} />
      </StyledMenuIconButton>

      <div ref={listboxRef} />

      <RecursiveMenuList
        open={openMenuDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenuDropdown(false)}
        menuGroups={menuItemGroups}
        buttonId={buttonId}
        menuId={menuId}
      />
    </HeadCellMenuWrapper>
  ) : null;
};

export default HeadCellMenu;
