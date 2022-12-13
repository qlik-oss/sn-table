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
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { StyledMenuIconButton, StyledCellMenu } from './styles';
import { GeneratedStyling } from '../../types';
import { ExtendedTranslator } from '../../../types';

const MenuItem = ({
  children,
  itemTitle,
  sortOrder,
  sortDirection,
  sortFromMenu,
  setOpen,
  isInteractionEnabled,
  isCurrentColumnActive,
}: {
  children: any;
  itemTitle: string;
  sortOrder: string;
  sortDirection: string;
  sortFromMenu(evt: React.MouseEvent, sortOrder: string): void;
  setOpen: any;
  isInteractionEnabled: boolean;
  isCurrentColumnActive: boolean;
}) => {
  let isDisabled = false;
  isDisabled =
    (!isInteractionEnabled ? !isDisabled : isDisabled) ||
    (isCurrentColumnActive && sortOrder === (sortDirection === 'asc' ? 'A' : 'D'));
  return (
    <ListItem disablePadding>
      <ListItemButton
        disabled={isDisabled}
        className="sn-table-head-menu-item-button"
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
  isInteractionEnabled,
  isCurrentColumnActive,
}: {
  headerStyle: GeneratedStyling;
  translator: ExtendedTranslator;
  sortDirection: string;
  sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  isInteractionEnabled: boolean;
  isCurrentColumnActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

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
                <MenuList
                  autoFocusItem={open}
                  className="sn-table-head-menu"
                  aria-labelledby="sn-table-head-menu-button"
                >
                  <MenuItem
                    itemTitle={translator.get('SNTable.MenuItem.SortAscending')}
                    sortOrder="A"
                    sortDirection={sortDirection}
                    sortFromMenu={sortFromMenu}
                    setOpen={setOpen}
                    isInteractionEnabled={isInteractionEnabled}
                    isCurrentColumnActive={isCurrentColumnActive}
                  >
                    <ArrowUpwardIcon />
                  </MenuItem>

                  <MenuItem
                    itemTitle={translator.get('SNTable.MenuItem.SortDescending')}
                    sortOrder="D"
                    sortDirection={sortDirection}
                    sortFromMenu={sortFromMenu}
                    setOpen={setOpen}
                    isInteractionEnabled={isInteractionEnabled}
                    isCurrentColumnActive={isCurrentColumnActive}
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
