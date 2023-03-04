import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import More from '@qlik-trial/sprout/icons/react/More';
import Search from '@qlik-trial/sprout/icons/react/Search';
import Selection from '@qlik-trial/sprout/icons/react/Selection';
import SelectAll from '@qlik-trial/sprout/icons/react/SelectAll';
import ClearSelections from '@qlik-trial/sprout/icons/react/ClearSelections';
import SelectPossible from '@qlik-trial/sprout/icons/react/SelectPossible';
import SelectAlternative from '@qlik-trial/sprout/icons/react/SelectAlternative';
import SelectExcluded from '@qlik-trial/sprout/icons/react/SelectExcluded';
import ColumnMove from '@qlik-trial/sprout/icons/react/ColumnMove';
import ColumnSize from '@qlik-trial/sprout/icons/react/ColumnSize';

import useFieldSelection from '../../hooks/use-field-selection';
import { useContextSelector, TableContext } from '../../context';
import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { HeadCellMenuWrapper, StyledMenuIconButton } from './styles';
import { TableLayout } from '../../../types';
import RecursiveMenuList from './MenuList/RecursiveMenuList';
import { DEFAULT_FONT_SIZE } from '../../styling-defaults';

export default function HeadCellMenu({ column, tabIndex }: HeadCellMenuProps) {
  const showSearchMenuItem = column.isDim;
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const { translator, embed, model } = useContextSelector(TableContext, (value) => value.baseProps);
  const {
    fieldInstance,
    selectionActionsEnabledStatus,
    resetSelectionActionsEnabledStatus,
    updateSelectionActionsEnabledStatus,
  } = useFieldSelection(column);

  const embedListbox = useCallback(() => {
    const fieldId = column.qLibraryId ? { qLibraryId: column.qLibraryId, type: 'dimension' } : column.fieldId;
    // @ts-ignore TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.__DO_NOT_USE__.popover(listboxRef.current, fieldId, {
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
    });

    // @ts-ignore TODO: no types for popover related api until it becomes stable
    embed.on('fieldPopoverClose', () => {
      setOpenListboxDropdown(false);
    });
  }, [embed, column.fieldId, column.qLibraryId]);

  useEffect(() => {
    if (!openMenuDropdown) resetSelectionActionsEnabledStatus();
  }, [openMenuDropdown, resetSelectionActionsEnabledStatus]);

  const handleOpenDropdown = async () => {
    if (!openMenuDropdown && model) {
      const layout = await model.getLayout();
      updateSelectionActionsEnabledStatus(layout as TableLayout);
    }
    setOpenMenuDropdown(!openMenuDropdown);
  };

  const setFocusOnClosetColumnAdjuster = () => {
    setTimeout(() => {
      const adjusterHitArea = anchorRef.current
        ?.closest('.sn-table-cell')
        ?.querySelector('#adjuster-hit-area') as HTMLElement;
      adjusterHitArea.setAttribute('tabIndex', '0');
      adjusterHitArea.focus();
    }, 0);
  };

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      ...(showSearchMenuItem
        ? [
            [
              {
                id: 1,
                itemTitle: translator.get('SNTable.MenuItem.Search'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
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
                itemTitle: translator.get('SNTable.MenuItem.Selections'),
                icon: <Selection />,
                enabled: true,
                subMenus: [
                  [
                    {
                      id: 1,
                      itemTitle: translator.get('SNTable.MenuItem.SelectAll'),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectAll();
                      },
                      icon: <SelectAll />,
                      enabled: selectionActionsEnabledStatus.canSelectAll,
                    },
                    {
                      id: 2,
                      itemTitle: translator.get('SNTable.MenuItem.SelectPossible'),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectPossible();
                      },
                      icon: <SelectPossible />,
                      enabled: selectionActionsEnabledStatus.canSelectPossible,
                    },
                    {
                      id: 3,
                      itemTitle: translator.get('SNTable.MenuItem.SelectAlternative'),
                      onClick: async () => {
                        setOpenMenuDropdown(false);
                        await fieldInstance?.selectAlternative();
                      },
                      icon: <SelectAlternative />,
                      enabled: selectionActionsEnabledStatus.canSelectAlternative,
                    },
                    {
                      id: 4,
                      itemTitle: translator.get('SNTable.MenuItem.SelectExcluded'),
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
                      itemTitle: translator.get('SNTable.MenuItem.ClearSelections'),
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
            [
              {
                id: 1,
                itemTitle: translator.get('SNTable.MenuItem.ChangeColumnPosition'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
                  evt.stopPropagation();
                  setOpenMenuDropdown(false);
                },
                icon: <ColumnMove />,
                enabled: true,
              },
              {
                id: 2,
                itemTitle: translator.get('SNTable.MenuItem.AdjustColumnSize'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
                  evt.stopPropagation();
                  evt.preventDefault();
                  setOpenMenuDropdown(false);
                  setFocusOnClosetColumnAdjuster();
                },
                icon: <ColumnSize />,
                enabled: true,
              },
            ],
          ]
        : []),
    ],
    [translator, showSearchMenuItem, fieldInstance, selectionActionsEnabledStatus, embedListbox]
  );

  return menuItemGroups.length ? (
    <HeadCellMenuWrapper rightAligned={column.align === 'right'}>
      <StyledMenuIconButton
        isVisible={openListboxDropdown || openMenuDropdown}
        ref={anchorRef}
        size="small"
        tabIndex={tabIndex}
        id="sn-table-head-menu-button"
        aria-controls={openMenuDropdown ? 'sn-table-head-menu' : undefined}
        aria-expanded={openMenuDropdown ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpenDropdown}
      >
        <More height={DEFAULT_FONT_SIZE} />
      </StyledMenuIconButton>

      <div ref={listboxRef} />

      <RecursiveMenuList
        open={openMenuDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenuDropdown(false)}
        menuGroups={menuItemGroups}
        ariaLabel="sn-table-head-menu-button"
      />
    </HeadCellMenuWrapper>
  ) : null;
}
