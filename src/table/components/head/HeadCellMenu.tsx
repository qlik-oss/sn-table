import React, { useRef, useState, useMemo } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/react/More';
import Search from '@qlik-trial/sprout/icons/react/Search';
import Descending from '@qlik-trial/sprout/icons/react/Descending';
import Ascending from '@qlik-trial/sprout/icons/react/Ascending';

import { HeadCellMenuProps, MenuItemGroup } from '../../types';
import { StyledMenuIconButton, NebulaListBox } from './styles';
import { ListBoxWrapper, ListBoxWrapperRenderProps } from './ListBoxWrapper';
import MenuItems from './MenuItems';

export default function HeadCellMenu({
  translator,
  sortDirection,
  sortFromMenu,
  embed,
  layout,
  columnIndex,
  isInteractionEnabled,
  isCurrentColumnActive,
  isDimension,
}: HeadCellMenuProps) {
  const [openMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openListboxDropdown, setOpenListboxDropdown] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuItemGroups = useMemo<MenuItemGroup[]>(
    () => [
      [
        {
          id: 1,
          itemTitle: translator.get('SNTable.MenuItem.SortAscending'),
          onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
            sortFromMenu(evt, 'A');
            setOpenMenuDropdown(false);
          },
          icon: <Ascending />,
          isDisabled: !isInteractionEnabled || (isCurrentColumnActive && sortDirection === 'A'),
        },
        {
          id: 2,
          itemTitle: translator.get('SNTable.MenuItem.SortDescending'),
          onClick: (evt: React.MouseEvent<HTMLLIElement>) => {
            sortFromMenu(evt, 'D');
            setOpenMenuDropdown(false);
          },
          icon: <Descending />,
          isDisabled: !isInteractionEnabled || (isCurrentColumnActive && sortDirection === 'D'),
        },
      ],
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
    [translator, isInteractionEnabled, isCurrentColumnActive, sortDirection, isDimension]
  );

  return (
    <>
      <StyledMenuIconButton
        isVisible={openListboxDropdown || openMenuDropdown}
        ref={anchorRef}
        size="small"
        tabIndex={-1}
        id="sn-table-head-menu-button"
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
        <ListBoxWrapper layout={layout} embed={embed} columnIndex={columnIndex}>
          {({ ref }: ListBoxWrapperRenderProps) => <NebulaListBox ref={ref} />}
        </ListBoxWrapper>
      </Menu>
    </>
  );
}
