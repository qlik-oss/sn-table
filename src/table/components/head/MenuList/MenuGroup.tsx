import React, { useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import ArrowRight from '@qlik-trial/sprout/icons/react/ArrowRight';
import { HeadCellMenuItem, MenuItemGroup } from '../../../types';
import { StyledMenuItem, StyledListItemIcon, StyledMenuItemLabel } from '../styles';
import MenuList from './MenuList';

const subMenusIntercepted = (
  menuGroups: MenuItemGroup[],
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const result = menuGroups.map((grp) => {
    return grp.map((menuItem) => ({
      id: menuItem.id,
      icon: menuItem.icon,
      enabled: menuItem.enabled,
      itemTitle: menuItem.itemTitle,
      ...(menuItem.subMenus ? { subMenus: menuItem.subMenus } : {}),
      ...(menuItem.onClick
        ? {
            onClick: (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
              console.log('closing dropdown before closeing all stuff!');
              setOpenMenu(false);
              if (menuItem.onClick) menuItem.onClick(evt);
            },
          }
        : {}),
    }));
  });
  return result;
};

const MenuGroup = (menuGroup: HeadCellMenuItem[]) => {
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return menuGroup.map(({ id, icon, itemTitle, enabled, onClick, subMenus }) => {
    const handleOnClick = (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      if (onClick) onClick(evt);
      if (subMenus?.length) setOpenMenu(true);
    };

    return (
      <div>
        <StyledMenuItem
          ref={subMenus ? anchorRef : null}
          key={id}
          className="sn-table-head-menu-item"
          onClick={handleOnClick}
          disabled={!enabled}
        >
          <StyledMenuItemLabel>
            <StyledListItemIcon>{icon}</StyledListItemIcon>
            <Typography variant="body2">{itemTitle}</Typography>
          </StyledMenuItemLabel>
          {subMenus?.length ? <ArrowRight /> : null}
        </StyledMenuItem>

        {subMenus?.length && (
          <MenuList
            anchorRef={anchorRef.current}
            open={openMenu}
            onClose={() => setOpenMenu(false)}
            menuGroups={subMenusIntercepted(subMenus, setOpenMenu)}
            popoverProps={{
              transformOrigin: { horizontal: 'left', vertical: 'top' },
              anchorOrigin: { horizontal: 'right', vertical: 'top' },
            }}
          />
        )}
      </div>
    );
  });
};

export default MenuGroup;
