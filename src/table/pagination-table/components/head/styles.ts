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
    prop !== "background",
})(({ headerStyle, isNewHeadCellMenuEnabled, interactions, hoverBackground, background }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer", background }),
  pointer: "cursor",
  verticalAlign: "bottom",

  "&&:focus-visible": {
    ...(!isNewHeadCellMenuEnabled && { boxShadow: "none" }),
    ...(isNewHeadCellMenuEnabled && { background: interactions.active ? hoverBackground : background }),
  },

  ...(isNewHeadCellMenuEnabled && {
    "&&:hover": {
      background: interactions.active ? hoverBackground : background,
    },
  }),
}));
