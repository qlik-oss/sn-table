import React, { useState, useRef } from 'react';
import { MenuGroupProps } from '../../types';
import { MenuListDivider } from './styles';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function MenuGroup({ menus, shouldShowDevider }: MenuGroupProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={anchorRef}>
      {menus.map(({ id, icon, itemTitle, isDisabled, subMenu, onClick }, i) => (
        <ListItem
          disablePadding
          key={id}
          onMouseEnter={() => subMenu && setOpenMenu(true)}
          onMouseLeave={() => subMenu && setOpenMenu(false)}
        >
          <ListItemButton
            disabled={isDisabled}
            className="sn-table-head-menu-item-button"
            onClick={(...args) => !subMenu && onClick(...args)}
          >
            <ListItemIcon sx={{ minWidth: '25px' }}>{icon}</ListItemIcon>
            <ListItemText primary={itemTitle} />
            {subMenu && <ArrowForwardIosIcon />}
          </ListItemButton>

          <Popper
            modifiers={[{ name: 'offset', options: { offset: [208, -42] } }]}
            open={openMenu}
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
                  background: 'white',
                  zIndex: 10,
                }}
              >
                <Paper sx={{ boxShadow: 15 }}>
                  {subMenu &&
                    subMenu.map((menuGroup) => (
                      <MenuGroup shouldShowDevider={i !== subMenu.length - 1} {...menuGroup} />
                    ))}
                </Paper>
              </Grow>
            )}
          </Popper>
        </ListItem>
      ))}
      {shouldShowDevider && <MenuListDivider />}
    </div>
  );
}
