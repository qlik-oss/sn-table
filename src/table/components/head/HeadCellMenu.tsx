import React, { useRef, useState, useMemo } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import { HeadCellMenuProps, HeadCellMenuGroup } from '../../types';
import useListboxFilter from '../../hooks/use-listbox-filter';
import MenuGroup from './MenuGroup';
import { StyledMenuIconButton, StyledCellMenu, NebulaListBox, PrimaryDropdownPaper, MenuListDivider } from './styles';

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
}: HeadCellMenuProps) {
  const [openPrimaryDropdown, setOpenPrimaryDropdown] = useState(false);
  const [openSecondaryDropdown, setOpenSecondaryDropdown] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const elRef = useRef<HTMLElement | undefined>();
  const {} = useListboxFilter({ elRef, layout, embed, columnIndex, openSecondaryDropdown, openPrimaryDropdown });

  const getMenuItems = useMemo<HeadCellMenuGroup[]>(
    () => [
      {
        id: 1,
        menus: [
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
      {
        id: 2,
        menus: [
          {
            id: 1,
            itemTitle: translator.get('SNTable.MenuItem.Search'),
            onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              setOpenPrimaryDropdown(false);
              setOpenSecondaryDropdown(true);
            },
            icon: <SearchIcon />,
            isDisabled: false,
          },
        ],
      },
      {
        id: 3,
        menus: [
          {
            id: 1,
            itemTitle: translator.get('SNTable.MenuItem.Selections'),
            onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('Hi from selections'),
            icon: <HighlightAltIcon />,
            isDisabled: false,
            subMenu: [
              {
                id: 1,
                menus: [
                  {
                    id: 1,
                    itemTitle: translator.get('SNTable.MenuItem.SelectAll'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from SelectAll'),
                    icon: <SelectAllIcon />,
                    isDisabled: false,
                  },
                  {
                    id: 2,
                    itemTitle: translator.get('SNTable.MenuItem.ClearSelection'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      console.log('hi from ClearSelection'),
                    icon: <HighlightAltIcon />,
                    isDisabled: true,
                  },
                ],
              },
              {
                id: 2,
                menus: [
                  {
                    id: 1,
                    itemTitle: translator.get('SNTable.MenuItem.SelectPossible'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      console.log('hi from SelectPossible'),
                    icon: <SelectAllIcon />,
                    isDisabled: false,
                  },
                  {
                    id: 2,
                    itemTitle: translator.get('SNTable.MenuItem.SelectAlternative'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      console.log('hi from SelectAlternative'),
                    icon: <DeselectIcon />,
                    isDisabled: false,
                  },
                  {
                    id: 3,
                    itemTitle: translator.get('SNTable.MenuItem.SelectExcluded'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      console.log('hi from SelectExcluded'),
                    icon: <HighlightAltIcon />,
                    isDisabled: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        menus: [
          {
            id: 1,
            itemTitle: translator.get('SNTable.MenuItem.Utilities'),
            onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('Hi from Utilities'),
            icon: <SettingsIcon />,
            isDisabled: false,
            subMenu: [
              {
                id: 1,
                menus: [
                  {
                    id: 1,
                    itemTitle: translator.get('Util Menu #01'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from SelectAll'),
                    icon: <SelectAllIcon />,
                    isDisabled: false,
                  },
                  {
                    id: 2,
                    itemTitle: translator.get('Util Menu #02'),
                    onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      console.log('hi from ClearSelection'),
                    icon: <HighlightAltIcon />,
                    isDisabled: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    [translator, isInteractionEnabled, isCurrentColumnActive, sortDirection]
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
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <PrimaryDropdownPaper sx={{ boxShadow: 15 }}>
              <ClickAwayListener onClickAway={() => setOpenPrimaryDropdown(false)}>
                <MenuList
                  autoFocusItem={openPrimaryDropdown}
                  className="sn-table-head-menu"
                  aria-labelledby="sn-table-head-menu-button"
                >
                  {Object.entries(getMenuItems).map(([, menuGroup], i) => (
                    <MenuGroup
                      key={i}
                      {...menuGroup}
                      shouldShowDevider={i !== Object.entries(getMenuItems).length - 1}
                    />
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
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper sx={{ boxShadow: 15 }}>
              <ClickAwayListener onClickAway={() => setOpenSecondaryDropdown(false)}>
                <NebulaListBox ref={elRef} />
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
