import React, { useRef, useState, useEffect } from 'react';
import { stardust, embed } from '@nebula.js/stardust';
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

const MenuItem = ({
  children,
  itemTitle,
  sortOrder,
  sortFromMenu,
}: {
  children: any;
  itemTitle: string;
  sortOrder: string;
  sortFromMenu(evt: React.MouseEvent, sortOrder: string): void;
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={(evt) => sortFromMenu(evt, sortOrder)}>
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
  // embed,
  app,
  layout,
}: {
  headerStyle: GeneratedStyling;
  translator: ExtendedTranslator;
  sortFromMenu: (evt: React.MouseEvent, sortOrder: string) => void;
  // embed: stardust.Embed | undefined;
  layout: TableLayout;
  app: EngineAPI.IApp | undefined;
}) {
  console.log('£11111');
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const elRef = useRef<HTMLElement>();
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();

  const handleClickMenuOpen = () => {
    setOpen(true);
  };

  const handleClickMenuClose = (event: Event | React.SyntheticEvent) => {
    !anchorRef.current?.contains(event.target as HTMLElement) && setOpen(false);
  };

  // 000000000000000000000000000000000000000000000000
  const nebulaInstance = embed(app!);
  useEffect(() => {
    if (!layout || !nebulaInstance) {
      return;
    }

    console.log({ layout });

    nebulaInstance.field(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle).then((res) => {
      setListboxInstance(res);
    });
  }, [layout]);

  useEffect(() => {
    console.log(0, { listboxInstance, elRef });
    if (!elRef.current || !listboxInstance || !layout?.qHyperCube?.qDimensionInfo) {
      console.log(1111);
      return undefined;
    }

    console.log(222, { qDimensionInfo: layout?.qHyperCube?.qDimensionInfo });

    listboxInstance.mount(elRef.current);
    return () => {
      listboxInstance.unmount();
    };
  }, [elRef.current, listboxInstance]);

  // 000000000000000000000000000000000000000000000000

  return (
    <StyledCellMenu headerStyle={headerStyle}>
      <StyledMenuIconButton
        ref={anchorRef}
        tabIndex={-1}
        id="sn-table-head-menu-button"
        aria-controls={open ? 'sn-table-head-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClickMenuOpen}
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
              <ClickAwayListener onClickAway={handleClickMenuClose}>
                <MenuList
                  autoFocusItem={open}
                  className="sn-table-head-menu"
                  aria-labelledby="sn-table-head-menu-button"
                >
                  <MenuItem
                    itemTitle={translator.get('SNTable.MenuItem.SortAscending')}
                    sortOrder="A"
                    sortFromMenu={sortFromMenu}
                  >
                    <ArrowUpwardIcon />
                  </MenuItem>

                  <MenuItem
                    itemTitle={translator.get('SNTable.MenuItem.SortDescending')}
                    sortOrder="D"
                    sortFromMenu={sortFromMenu}
                  >
                    <ArrowDownwardIcon />
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
              <ClickAwayListener onClickAway={handleClickMenuClose}>
                <NebulaListBox ref={elRef} />
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledCellMenu>
  );
}
