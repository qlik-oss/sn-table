/* eslint-disable import/no-cycle */
import React, { useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import ArrowRight from '@qlik-trial/sprout/icons/react/ArrowRight';
import { HeadCellMenuItem, MenuItemGroup } from '../../../types';
import { StyledMenuItem, StyledListItemIcon, StyledMenuItemLabel } from '../styles';
import RecursiveMenuList from './RecursiveMenuList';

export const interceptClickOnMenuItems = (menuGroups: MenuItemGroup[], cache: SubMenusOpenStatusCache) => {
  const result = menuGroups.map((grp) => {
    return grp.map(({ onClick, ...restProps }) => ({
      ...restProps,
      ...(onClick
        ? {
            onClick: (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
              // reset all opened submenu levels here!
              Object.entries(cache).map(([, setter]) => setter(false));
              onClick(evt);
            },
          }
        : {}),
    }));
  });
  return result;
};

type SubMenusOpenStatusCache = Record<string, React.Dispatch<React.SetStateAction<boolean>>>;
let subMenusOpenStatusCache: SubMenusOpenStatusCache = {};

const MenuGroupItems = ({ autoFocus, id, onClick, itemTitle, icon, enabled, subMenus }: HeadCellMenuItem) => {
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const moveToNextFocusItem = (currentFocus: Element): Element | undefined => {
    const nextItem = currentFocus.nextElementSibling;
    if (!nextItem) {
      return currentFocus.parentElement?.children?.[0];
    }
    if (nextItem.tagName === 'HR') {
      return moveToNextFocusItem(nextItem);
    }
    return nextItem;
  };

  const moveToPreviousFocusItem = (currentFocus: Element): Element | undefined => {
    const previousItem = currentFocus.previousElementSibling;
    if (!previousItem) {
      const menuItemAmount = currentFocus.parentElement?.children?.length as number;
      return currentFocus.parentElement?.children?.[menuItemAmount - 1];
    }
    if (previousItem.tagName === 'HR') {
      return moveToPreviousFocusItem(previousItem);
    }
    return previousItem;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const { key } = event;

    const currentFocus = document.activeElement ?? (event.target as HTMLElement);

    // The rest key are handled by handleKeyDown in MUIMenuList
    if (key === 'ArrowDown') {
      // Prevent scroll of the page
      event.preventDefault();
      // Stop triggering handleKeyDown in MUIMenuList
      event.stopPropagation();
      let nextFocusItem = moveToNextFocusItem(currentFocus);
      while (nextFocusItem) {
        if (nextFocusItem.ariaDisabled === 'true') {
          nextFocusItem = moveToNextFocusItem(nextFocusItem);
        } else {
          (nextFocusItem as HTMLElement).focus();
          break;
        }
      }
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      let nextFocusItem = moveToPreviousFocusItem(currentFocus);
      while (nextFocusItem) {
        if (nextFocusItem.ariaDisabled === 'true') {
          nextFocusItem = moveToPreviousFocusItem(nextFocusItem);
        } else {
          (nextFocusItem as HTMLElement).focus();
          break;
        }
      }
    }
  };

  const handleOnClick = (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (onClick) {
      onClick(evt);
      subMenusOpenStatusCache = {};
    }
    if (subMenus?.length) {
      setOpenMenu(true);
      subMenusOpenStatusCache[itemTitle] = setOpenMenu;
    }
  };

  return (
    <>
      <StyledMenuItem
        ref={subMenus ? anchorRef : null}
        key={id}
        data-testid={`menu-item-${id}`}
        className="sn-table-head-menu-item"
        onClick={handleOnClick}
        disabled={!enabled}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
      >
        <StyledMenuItemLabel>
          <StyledListItemIcon>{icon}</StyledListItemIcon>
          <Typography variant="body2">{itemTitle}</Typography>
        </StyledMenuItemLabel>
        {subMenus?.length ? <ArrowRight /> : null}
      </StyledMenuItem>

      {subMenus?.length && (
        <RecursiveMenuList
          anchorEl={anchorRef.current}
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          menuGroups={interceptClickOnMenuItems(subMenus, subMenusOpenStatusCache)}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
      )}
    </>
  );
};

const MenuGroup = ({ menuGroup }: { menuGroup: HeadCellMenuItem[] }) => {
  return menuGroup.map((groupItem) => <MenuGroupItems key={groupItem.id} {...groupItem} />);
};

export default MenuGroup;
