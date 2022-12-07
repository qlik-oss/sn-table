import React, { useRef, useState, useEffect } from 'react';
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { StyledMenuIconButton, StyledCellMenu, NebulaListBox } from './styles';
import { GeneratedStyling } from '../../types';
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
  sortFromMenu,
  embed,
  layout,
  columnIndex,
}: {
  headerStyle: GeneratedStyling;
  translator: ExtendedTranslator;
  sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  embed: stardust.Embed | undefined;
  layout: TableLayout;
  columnIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const elRef = useRef<HTMLElement | undefined>();
  const {} = useListboxFilter({ elRef, layout, embed, columnIndex, open });

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
                  >
                    <MenuItem
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
                    </MenuItem>
                  </MenuList>
                  <NebulaListBox ref={elRef} />
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
