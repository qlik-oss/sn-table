import React, { useRef, useState, useMemo } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { HeadCellMenuProps, HeadCellMenuGroup } from '../../types';
import MenuGroup from './MenuGroup';
import { StyledMenuIconButton, StyledCellMenu, NebulaListBox, PrimaryDropdownPaper } from './styles';
import { ListBoxWrapper, ListBoxWrapperRenderProps } from './ListBoxWrapper';

export default function HeadCellMenu({
  headerStyle,
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
  const [openPrimaryDropdown, setOpenPrimaryDropdown] = useState(false);
  const [openSecondaryDropdown, setOpenSecondaryDropdown] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const menuItems = useMemo<HeadCellMenuGroup[]>(
    () => [
      {
        id: 1,
        options: [
          {
            id: 1,
            itemTitle: translator.get('SNTable.MenuItem.SortAscending'),
            onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              sortFromMenu(evt, 'A');
              setOpenPrimaryDropdown(false);
            },
            icon: <ArrowUpwardIcon />,
            isDisabled: !isInteractionEnabled || (isCurrentColumnActive && sortDirection === 'A'),
          },
          {
            id: 2,
            itemTitle: translator.get('SNTable.MenuItem.SortDescending'),
            onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              sortFromMenu(evt, 'D');
              setOpenPrimaryDropdown(false);
            },
            icon: <ArrowDownwardIcon />,
            isDisabled: !isInteractionEnabled || (isCurrentColumnActive && sortDirection === 'D'),
          },
        ],
      },
      ...(isDimension
        ? [
            {
              id: 2,
              options: [
                {
                  id: 1,
                  itemTitle: translator.get('SNTable.MenuItem.Search'),
                  onClick: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    evt.stopPropagation();
                    setOpenPrimaryDropdown(false);
                    setOpenSecondaryDropdown(true);
                  },
                  icon: <SearchIcon />,
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
    <StyledCellMenu headerStyle={headerStyle}>
      <StyledMenuIconButton
        ref={anchorRef}
        tabIndex={-1}
        id="sn-table-head-menu-button"
        aria-controls={openPrimaryDropdown ? 'sn-table-head-menu' : undefined}
        aria-expanded={openPrimaryDropdown ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => setOpenPrimaryDropdown(!openPrimaryDropdown)}
      >
        <MoreHoriz />
      </StyledMenuIconButton>
      <Popper
        modifiers={[{ name: 'offset', options: { offset: [0, 9] } }]}
        open={openPrimaryDropdown}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
            <PrimaryDropdownPaper sx={{ boxShadow: 15 }}>
              <ClickAwayListener onClickAway={() => setOpenPrimaryDropdown(false)}>
                <MenuList
                  autoFocusItem={openPrimaryDropdown}
                  className="sn-table-head-menu"
                  aria-labelledby="sn-table-head-menu-button"
                >
                  {menuItems.map((menuGroup, i) => (
                    <MenuGroup key={menuGroup.id} {...menuGroup} shouldShowDevider={i !== menuItems.length - 1} />
                  ))}
                </MenuList>
              </ClickAwayListener>
            </PrimaryDropdownPaper>
          </Grow>
        )}
      </Popper>

      <Popper
        modifiers={[{ name: 'offset', options: { offset: [0, 9] } }]}
        open={openSecondaryDropdown}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
            <Paper sx={{ boxShadow: 15 }}>
              <ListBoxWrapper layout={layout} embed={embed} columnIndex={columnIndex}>
                {({ ref }: ListBoxWrapperRenderProps) => (
                  <ClickAwayListener onClickAway={() => setOpenSecondaryDropdown(false)}>
                    <NebulaListBox ref={ref} />
                  </ClickAwayListener>
                )}
              </ListBoxWrapper>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
