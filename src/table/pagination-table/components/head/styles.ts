import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COMMON_CELL_STYLING } from "../../../styling-defaults";

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) =>
    prop !== "headerStyle" &&
    prop !== "isNewHeadCellMenuEnabled" &&
    prop !== "interactions" &&
    prop !== "hoverBackground" &&
    prop !== "background" &&
    prop !== "isActivelySorted",
})(({ headerStyle, isNewHeadCellMenuEnabled, interactions, hoverBackground, background, isActivelySorted }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer", background }),
  pointer: "cursor",
  verticalAlign: "bottom",
  // border: "1px dashed springgreen",

  // "&:focus": {
  //   boxShadow: "none",
  // },

  "&&:focus": {
    ...(!isNewHeadCellMenuEnabled && { boxShadow: "0 0 0 2px #177fe6 inset, 0 0 0 3px #fff inset" }),
    // "& svg": {
    //   ...(!isNewHeadCellMenuEnabled && { opacity: isActivelySorted ? 1 : 0.5 }),
    // },
  },

  "&&:hover": {
    ...(isNewHeadCellMenuEnabled && { background: interactions.active ? hoverBackground : background }),
  },
}));
