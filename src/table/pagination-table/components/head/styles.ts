import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COMMON_CELL_STYLING } from "../../../styling-defaults";

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop) =>
    !["headerStyle", "isNewHeadCellMenuEnabled", "interactions", "hoverBackground", "background"].includes(
      prop as string
    ),
})(({ headerStyle, isNewHeadCellMenuEnabled, interactions, hoverBackground, background }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer" }),
  pointer: "cursor",
  verticalAlign: "bottom",
  background,

  "&:focus": {
    boxShadow: "none",
  },

  "&&:hover": {
    background: interactions.active ? hoverBackground : background,
  },
}));
