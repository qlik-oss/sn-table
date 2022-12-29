import React, { useRef, useState, useMemo } from 'react';
import { stardust } from '@nebula.js/stardust';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { StyledMenuIconButton, StyledCellMenu, NebulaListBox } from './styles';
import { GeneratedStyling } from '../../types';
import { HeadCellMenuProps } from '../../types';
import { SortDirection } from '../../../types';
import { ExtendedTranslator, TableLayout } from '../../../types';
import useListboxFilter from '../../hooks/use-listbox-filter';

const MenuItem = ({
  children,
  itemTitle,
  sortOrder,
  sortFromMenu,
  setOpen,
}: {
  children: any;
  itemTitle: string;
  sortOrder: string;
  sortFromMenu(evt: React.MouseEvent, sortOrder: string): void;
  setOpen: any;
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={(evt) => {
          sortFromMenu(evt, sortOrder);
          setOpen(false);
        }}
      >
        <ListItemIcon sx={{ minWidth: '25px' }}>{children}</ListItemIcon>
        <ListItemText primary={itemTitle} />
      </ListItemButton>
    </ListItem>
  );
};

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
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const elRef = useRef<HTMLElement | undefined>();
  const {} = useListboxFilter({ elRef, layout, embed, columnIndex, open });

  const getMenuItems = useMemo(
    () => [
      {
        id: 0,
        label: translator.get('SNTable.MenuItem.SortAscending'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from sort up'),
        icon: <ArrowUpwardIcon />,
      },
      {
        id: 1,
        label: translator.get('SNTable.MenuItem.SortDescending'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from sort down'),
        icon: <ArrowDownwardIcon />,
      },
      {
        id: 2,
        label: translator.get('SNTable.MenuItem.Search'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from search'),
        icon: <SearchIcon />,
      },
      {
        id: 3,
        label: translator.get('SNTable.MenuItem.Possible'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from possible'),
        icon: <SelectAllIcon />,
      },
      {
        id: 4,
        label: translator.get('SNTable.MenuItem.Excluded'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from excluded'),
        icon: <HighlightAltIcon />,
      },
      {
        id: 5,
        label: translator.get('SNTable.MenuItem.ClearOthers'),
        onClick: (_evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => console.log('hi from Clear others'),
        icon: <DeselectIcon />,
      },
    ],
    [translator]
  );

  const MenuItem = ({
    children,
    itemTitle,
    newSortDirection,
  }: {
    children: any;
    itemTitle: string;
    newSortDirection: SortDirection;
  }) => {
    const isDisabled = !isInteractionEnabled || (isCurrentColumnActive && newSortDirection === sortDirection);
    return (
      <ListItem disablePadding>
        <ListItemButton
          disabled={isDisabled}
          className="sn-table-head-menu-item-button"
          onClick={(evt) => {
            sortFromMenu(evt, newSortDirection);
            setOpen(false);
          }}
        >
          <ListItemIcon sx={{ minWidth: '25px' }}>{children}</ListItemIcon>
          <ListItemText primary={itemTitle} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <StyledCellMenu headerStyle={headerStyle}>
      <StyledMenuIconButton
        ref={anchorRef}
        tabIndex={-1}
        id="sn-table-head-menu-button"
        aria-controls={open ? 'sn-table-head-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <MoreHoriz />
      </StyledMenuIconButton>
      <Popper
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 9],
            },
          },
        ]}
        open={open}
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
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div>
                  <MenuList
                    autoFocusItem={open}
                    className="sn-table-head-menu"
                    aria-labelledby="sn-table-head-menu-button"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {translator.get('SNTable.MenuList.Subheader')}
                      </ListSubheader>
                    }
                  >
                    {getMenuItems.map(({ id, label, onClick, icon }) => (
                      <ListItem disablePadding key={id}>
                        <ListItemButton onClick={onClick}>
                          <ListItemIcon sx={{ minWidth: '25px' }}>{icon}</ListItemIcon>
                          <ListItemText primary={label} />
                        </ListItemButton>
                      </ListItem>
                    ))}

                    {/* <MenuItem
                      itemTitle={translator.get('SNTable.MenuItem.SortAscending')}
                      sortOrder="A"
                      sortFromMenu={sortFromMenu}
                      setOpen={setOpen}
                    >
                      <ArrowUpwardIcon />
                    </MenuItem>

                    <MenuItem
                      itemTitle={translator.get('SNTable.MenuItem.SortDescending')}
                      sortOrder="D"
                      sortFromMenu={sortFromMenu}
                      setOpen={setOpen}
                    >
                      <ArrowDownwardIcon />
                    </MenuItem> */}
                  </MenuList>
                  <NebulaListBox ref={elRef} />
                </div>

                {/* <MenuList
                  autoFocusItem={open}
                  className="sn-table-head-menu"
                  aria-labelledby="sn-table-head-menu-button"
                >
                  <MenuItem itemTitle={translator.get('SNTable.MenuItem.SortAscending')} newSortDirection="A">
                    <ArrowUpwardIcon />
                  </MenuItem>

                  <MenuItem itemTitle={translator.get('SNTable.MenuItem.SortDescending')} newSortDirection="D">
                    <ArrowDownwardIcon />
                  </MenuItem>
                </MenuList> */}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
