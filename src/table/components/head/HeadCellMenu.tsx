import React, { useRef, useState, useMemo } from 'react';
import Menu from '@mui/material/Menu';
import More from '@qlik-trial/sprout/icons/More';
import Search from '@qlik-trial/sprout/icons/Search';
import Descending from '@qlik-trial/sprout/icons/Descending';
import Ascending from '@qlik-trial/sprout/icons/Ascending';

import { HeadCellMenuProps, HeadCellMenuGroup } from '../../types';
import MenuGroup from './MenuGroup';
import { StyledMenuIconButton, NebulaListBox } from './styles';
import { ListBoxWrapper, ListBoxWrapperRenderProps } from './ListBoxWrapper';

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

  const menuItems = useMemo<HeadCellMenuGroup[]>(
    () => [
      {
        id: 'group-0',
        options: [
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
      },
      ...(isDimension
        ? [
            {
              id: 'group-1',
              options: [
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
            },
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
        <More size="small" />
      </StyledMenuIconButton>

      <Menu
        className="sn-table-head-menu"
        aria-labelledby="sn-table-head-menu-button"
        open={openMenuDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenMenuDropdown(false)}
      >
        {menuItems.map((menuGroup) => (
          <MenuGroup key={menuGroup.id} {...menuGroup} />
        ))}
      </Menu>

      <Menu
        className="sn-table-head-menu"
        aria-labelledby="sn-table-head-menu-button"
        open={openListboxDropdown}
        anchorEl={anchorRef.current}
        onClose={() => setOpenListboxDropdown(false)}
      >
        <ListBoxWrapper layout={layout} embed={embed} columnIndex={columnIndex}>
          {({ ref }: ListBoxWrapperRenderProps) => <NebulaListBox ref={ref} />}
        </ListBoxWrapper>
      </Menu>
    </>
  );
}
