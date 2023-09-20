/* eslint-disable import/no-cycle */
import Typography from "@mui/material/Typography";
import ArrowRight from "@qlik-trial/sprout/icons/react/ArrowRight";
import React, { useRef, useState } from "react";
import { HeadCellMenuItem, MenuItemGroup } from "../../../types";
import { handleHeadCellMenuKeyDown } from "../../../utils/handle-keyboard";
import { StyledListItemIcon, StyledMenuItem, StyledMenuItemLabel } from "../styles";
import RecursiveMenuList from "./RecursiveMenuList";

export const interceptClickOnMenuItems = (menuGroups: MenuItemGroup[], cache: SubMenusOpenStatusCache) => {
  const result = menuGroups.map((grp) =>
    grp.map(({ onClick, ...restProps }) => ({
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
    }))
  );
  return result;
};

type SubMenusOpenStatusCache = Record<string, React.Dispatch<React.SetStateAction<boolean>>>;
let subMenusOpenStatusCache: SubMenusOpenStatusCache = {};

const MenuGroupItems = ({ autoFocus, id, onClick, itemTitle, icon, enabled, subMenus }: HeadCellMenuItem) => {
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

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
        onKeyDown={handleHeadCellMenuKeyDown}
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
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
      )}
    </>
  );
};

const MenuGroup = ({ menuGroup }: { menuGroup: HeadCellMenuItem[] }) =>
  menuGroup.map((groupItem) => <MenuGroupItems key={groupItem.id} {...groupItem} />);

export default MenuGroup;
