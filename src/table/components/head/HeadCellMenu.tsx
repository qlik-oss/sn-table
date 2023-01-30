import React, { useRef, useState, useMemo } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/react/More';
import Search from '@qlik-trial/sprout/icons/react/Search';

import { useContextSelector, TableContext } from '../../context';
import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { StyledMenuIconButton, NebulaListBox } from './styles';
import { ListBoxWrapper, ListBoxWrapperRenderProps } from './ListBoxWrapper';
import MenuItems from './MenuItems';

export default function HeadCellMenu({ columnIndex, isDimension, tabIndex, isLastElement }: HeadCellMenuProps) {
  const { translator } = useContextSelector(TableContext, (value) => value.baseProps);
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      ...(isDimension
        ? [
            [
              {
                id: 3,
                itemTitle: translator.get('SNTable.MenuItem.Search'),
                onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
                  evt.stopPropagation();
                  setOpenMenuDropdown(false);
                  setOpenListboxDropdown(true);
                },
                icon: <Search />,
                isDisabled: false,
              },
            ],
          ]
        : []),
    ],
    [translator, isDimension]
  );

  return menuItemGroups.length ? (
    <>
      <StyledMenuIconButton
        isVisible={openListboxDropdown || openMenuDropdown}
        ref={anchorRef}
        size="small"
        tabIndex={tabIndex}
        id="sn-table-head-menu-button"
        className={isLastElement ? 'sn-table-head-last-cell' : ''}
        aria-controls={openMenuDropdown ? 'sn-table-head-menu' : undefined}
        aria-expanded={openMenuDropdown ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => setOpenMenuDropdown(!openMenuDropdown)}
      >
        <More height="12px" />
      </StyledMenuIconButton>

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

      <Menu open={openListboxDropdown} anchorEl={anchorRef.current} onClose={() => setOpenListboxDropdown(false)}>
        <ListBoxWrapper columnIndex={columnIndex}>
          {({ ref }: ListBoxWrapperRenderProps) => <NebulaListBox ref={ref} />}
        </ListBoxWrapper>
      </Menu>
    </>
  ) : null;
}
