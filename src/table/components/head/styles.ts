import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

import { HEAD_ICON_WRAPPER_SIZE, LOCK_ICON_SIZE } from "../../constants";
import { DEFAULT_FONT_SIZE } from "../../styling-defaults";

// ---------- HeadCellContent ----------
export const AbsolutelyStyledRefAnchor = styled("div")({
  position: "absolute",
  left: 0,
  bottom: 0,
});

export const StyledSortButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop != "isActivelySorted" && prop != "textAlign" && prop != "disabled" && prop != "isNewHeadCellMenuEnabled",
})(({ isActivelySorted, textAlign, disabled, theme, isNewHeadCellMenuEnabled }) => ({
  textAlign,
  height: "auto",
  maxWidth: "100%",
  fontSize: "inherit",
  fontFamily: "inherit",
  padding: theme.spacing(0.5, 1),
  color: "inherit",
  alignItems: "flex-end",
  cursor: disabled ? "auto" : "pointer",
  justifySelf: textAlign,
  "&&:focus, &&:hover": {
    ...(isNewHeadCellMenuEnabled && { background: "transparent" }),
    "& svg": {
      ...(!isNewHeadCellMenuEnabled && { opacity: isActivelySorted ? 1 : 0.5 }),
    },
  },
  "& svg": {
    opacity: isActivelySorted ? 1 : 0,
    fontSize: DEFAULT_FONT_SIZE,
  },
  "& .Mui-disabled": {
    color: "inherit",
  },
  "& .MuiButton-endIcon, .MuiButton-startIcon": {
    marginBottom: "2px",
    visibility: disabled ? "hidden" : "visible",
  },
}));

export const VisuallyHidden = styled("span")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  top: 20,
  width: 1,
});

export const StyledHeadCellContent = styled(Box, {
  shouldForwardProp: (prop) => prop != "isLocked" && prop != "isNewHeadCellMenuEnabled",
})(({ theme, isLocked, isNewHeadCellMenuEnabled }) => ({
  width: "100%",
  display: "grid",
  flexDirection: "inherit",
  gridAutoFlow: "dense",
  gap: theme.spacing(0.5),
  fontSize: "inherit",
  fontFamily: "inherit",
  overflow: "hidden",
  ...(isNewHeadCellMenuEnabled && { alignItems: "end" }),

  "&&:hover, &&:focus-within": {
    "& .sn-table-head-menu-button": { opacity: 1 },
  },

  "& > div:last-child": { alignSelf: "flex-end" },

  "&.aligned-left": {
    gridTemplateColumns: isLocked
      ? `${LOCK_ICON_SIZE}px 2fr ${HEAD_ICON_WRAPPER_SIZE}px`
      : `1fr ${HEAD_ICON_WRAPPER_SIZE}px`,
  },

  "&.aligned-center": {
    gridTemplateColumns: `${HEAD_ICON_WRAPPER_SIZE}px 2fr ${HEAD_ICON_WRAPPER_SIZE}px`,

    "& > div:first-child": { gridColumn: 1 },
    "& .sn-table-head-label": { gridColumn: 2 },
    "& > div:last-child": { gridColumn: 3 },
  },

  "&.aligned-right": {
    gridTemplateColumns: isLocked
      ? `${HEAD_ICON_WRAPPER_SIZE}px 2fr ${LOCK_ICON_SIZE}px`
      : `${HEAD_ICON_WRAPPER_SIZE}px 1fr`,

    "& > div:first-child": { gridColumn: isLocked ? 3 : "unset" },
    "& .sn-table-head-label": { gridColumn: 2 },
    "& > div:last-child": { gridColumn: 1 },
  },
}));

export const StyledHeadCellIconWrapper = styled("div")({
  display: "flex",
  alignSelf: "flex-end",
});

export const LockWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: `${LOCK_ICON_SIZE}px`,
  height: `${HEAD_ICON_WRAPPER_SIZE}px`,
  flexShrink: 0,
  flexDirection: "inherit",

  "&.aligned-right": { justifyContent: "flex-start" },
  "&.aligned-center, &.aligned-left": { justifyContent: "flex-end" },
});

// ---------- HeadCellMenu ----------
export const HeadCellMenuWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible" && prop !== "rightAligned",
})(({ rightAligned }) => ({
  ...(rightAligned ? { marginRight: "auto" } : { marginLeft: "auto" }),
  height: `${HEAD_ICON_WRAPPER_SIZE}px`,
  display: "flex",
}));

export const StyledMenuIconButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isVisible" && prop !== "rightAligned",
})(({ isVisible }) => ({
  opacity: isVisible ? 1 : 0,
  "&:focus": {
    opacity: 1,
  },
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  "&.MuiDivider-root": {
    margin: theme.spacing(0.5),
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: "4px",
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 1.5),
  display: "flex",
  justifyContent: "space-between",
  "&&:focus": {
    boxShadow: "rgb(23, 127, 230) 0px 0px 0px 2px",
  },
}));

export const StyledMenuItemLabel = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  lineHeight: 0,
}));

export const NebulaListBox = styled("div")(({ theme }) => ({
  height: "350px",
  boxSizing: "border-box",
  background: theme.palette.common.white,
}));
