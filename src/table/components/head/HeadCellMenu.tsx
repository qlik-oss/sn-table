import React, { useRef, useState, useMemo, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/react/More';
import Search from '@qlik-trial/sprout/icons/react/Search';
import SelectAll from '@qlik-trial/sprout/icons/react/SelectAll';
import ClearSelections from '@qlik-trial/sprout/icons/react/ClearSelections';
import SelectPossible from '@qlik-trial/sprout/icons/react/SelectPossible';
import SelectAlternative from '@qlik-trial/sprout/icons/react/SelectAlternative';
import SelectExcluded from '@qlik-trial/sprout/icons/react/SelectExcluded';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { StyledMenuIconButton } from './styles';
import { TableLayout } from '../../../types';
import MenuItems from './MenuItems';

export default function HeadCellMenu({ column, tabIndex }: HeadCellMenuProps) {
  const { app, translator, embed, model } = useContextSelector(TableContext, (value) => value.baseProps);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const showSearchMenuItem = column.isDim && !column.isMasterItem;
  const [fieldInstance, setFieldInstance] = useState<EngineAPI.IField | null>(null);
  const [enabledSelectionActions, setEnabledSelectionActions] = useState<Record<string, boolean>>({
    canSelectAll: false,
    canClearSelections: false,
    canSelectPossible: false,
    canSelectAlternative: false,
    canSelectExcluded: false,
  });

  useEffect(() => {
    if (!app || !column || !showSearchMenuItem) return;
    app.getField(column.fieldId).then(setFieldInstance);
  }, [app, column]);

  const embedListbox = () => {
    // @ts-ignore TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.__DO_NOT_USE__.popover(listboxRef.current, column.fieldId, {
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
    });

    // @ts-ignore TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.on('fieldPopoverClose', () => {
      setOpenListboxDropdown(false);
    });
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
                itemTitle: translator.get('SNTable.MenuItem.SelectAll'),
                onClick: async () => {
                  setOpenMenuDropdown(false);
                  await fieldInstance?.selectAll();
                },
                icon: <SelectAll />,
                enabled: enabledSelectionActions.canSelectAll,
              },
              {
                id: 2,
                itemTitle: translator.get('SNTable.MenuItem.ClearSelections'),
                onClick: async () => {
                  setOpenMenuDropdown(false);
                  await fieldInstance?.clear();
                },
                icon: <ClearSelections />,
                enabled: enabledSelectionActions.canClearSelections,
              },
              {
                id: 3,
                itemTitle: translator.get('SNTable.MenuItem.SelectPossible'),
                onClick: async () => {
                  setOpenMenuDropdown(false);
                  await fieldInstance?.selectPossible();
                },
                icon: <SelectPossible />,
                enabled: enabledSelectionActions.canSelectPossible,
              },
              {
                id: 4,
                itemTitle: translator.get('SNTable.MenuItem.SelectAlternative'),
                onClick: async () => {
                  setOpenMenuDropdown(false);
                  await fieldInstance?.selectAlternative();
                },
                icon: <SelectAlternative />,
                enabled: enabledSelectionActions.canSelectAlternative,
              },
              {
                id: 5,
                itemTitle: translator.get('SNTable.MenuItem.SelectExcluded'),
                onClick: async () => {
                  setOpenMenuDropdown(false);
                  await fieldInstance?.selectExcluded();
                },
                icon: <SelectExcluded />,
                enabled: enabledSelectionActions.canSelectExcluded,
              },
            ],
          ]
        : []),
    ],
    [translator, showSearchMenuItem, fieldInstance, enabledSelectionActions]
  );

  const checkStateCountByKey = <T,>(keys: (keyof T)[], obj: T): boolean => {
    return keys.some((key) => obj[key] > 0);
  };

  const updateEnabledSelectionActions = (layout: TableLayout) => {
    const dimInfo = layout.qHyperCube.qDimensionInfo.find((dim) => dim.qFallbackTitle === column.label);
    if (!dimInfo) return;
    setEnabledSelectionActions({
      canSelectAll: checkStateCountByKey(['qOption', 'qAlternative', 'qExcluded', 'qDeselected'], dimInfo.qStateCounts),
      canClearSelections: checkStateCountByKey(['qSelected'], dimInfo.qStateCounts),
      canSelectPossible: checkStateCountByKey(['qOption'], dimInfo.qStateCounts),
      canSelectAlternative: checkStateCountByKey(['qAlternative'], dimInfo.qStateCounts),
      canSelectExcluded: checkStateCountByKey(['qAlternative', 'qExcluded'], dimInfo.qStateCounts),
    });
  };

  const handleOpenDropdown = async () => {
    if (!model) return;
    setOpenMenuDropdown(!openMenuDropdown);
    model.getLayout().then((l) => updateEnabledSelectionActions(l as TableLayout));
  };

  return menuItemGroups.length ? (
    <>
      <div>
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
          <More height="12px" />
        </StyledMenuIconButton>

        <div ref={listboxRef} />
      </div>

      <Menu
        className="sn-table-head-menu"
        aria-labelledby="sn-table-head-menu-button"
        open={openMenuDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenuDropdown(false)}
        autoFocus={false}
      >
        {MenuItems({ itemGroups: menuItemGroups })}
      </Menu>
    </>
  ) : null;
}
