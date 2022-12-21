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
import { ExtendedTranslator, SortDirection } from '../../../types';

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
  sortDirection: SortDirection;
  sortFromMenu: (evt: React.MouseEvent, sortOrder: SortDirection) => void;
  isInteractionEnabled: boolean;
  isCurrentColumnActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

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
                <MenuList
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
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
