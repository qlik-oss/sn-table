import React, { useRef, useState } from 'react';
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
import More from '@qlik-trial/sprout/icons/More';

import { StyledMenuIconButton, StyledCellMenu } from './styles';
import { GeneratedStyling } from '../../types';
import { ExtendedTranslator } from '../../../types';

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
}: {
  headerStyle: GeneratedStyling;
  translator: ExtendedTranslator;
  sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <StyledCellMenu headerStyle={headerStyle}>
      <StyledMenuIconButton
        ref={anchorRef}
        size="small"
        tabIndex={-1}
        id="sn-table-head-menu-button"
        aria-controls={open ? 'sn-table-head-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <More size="small" />
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
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
