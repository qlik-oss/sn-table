import React, { useRef, useState, useMemo } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/More';
import Search from '@qlik-trial/sprout/icons/Search';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { StyledMenuIconButton } from './styles';
import MenuItems from './MenuItems';

export default function HeadCellMenu({ column, tabIndex }: HeadCellMenuProps) {
  const { translator, embed } = useContextSelector(TableContext, (value) => value.baseProps);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const showListboxMenu = column.isDim && !column.isMasterDim;

  const embedListbox = () => {
    // @ts-ignore TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.__DO_NOT_USE__.popover(listboxRef.current, column.label, {
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
    });

    // @ts-ignore TODO: no types for `__DO_NOT_USE__`, it will improve when it becomes stable
    // eslint-disable-next-line
    embed.__DO_NOT_USE__.on('closePopover', () => {
      setOpenListboxDropdown(false);
    });
  };

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      ...(showListboxMenu
        ? [
            [
              {
                id: 3,
                itemTitle: translator.get('SNTable.MenuItem.Search'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
                  evt.stopPropagation();
                  setOpenMenuDropdown(false);
                  setOpenListboxDropdown(true);
                  embedListbox();
                },
                icon: <Search />,
                isDisabled: false,
              },
            ],
          ]
        : []),
    ],
    [translator, showListboxMenu]
  );

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
          onClick={() => setOpenMenuDropdown(!openMenuDropdown)}
        >
          <More size="small" />
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
