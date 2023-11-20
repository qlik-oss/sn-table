import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COMMON_CELL_STYLING } from "../../../styling-defaults";

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop) =>
    prop != "headerStyle" &&
    prop != "isNewHeadCellMenuEnabled" &&
    prop != "interactions" &&
    prop != "hoverBackground" &&
    prop != "background",
})(({ headerStyle, isNewHeadCellMenuEnabled, interactions, hoverBackground, background }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer", background }),
  pointer: "cursor",
  verticalAlign: "bottom",

  "&:focus": {
    boxShadow: "none",
  },

  "&&:hover": {
    ...(isNewHeadCellMenuEnabled && { background: interactions.active ? hoverBackground : background }),
  },
}));
