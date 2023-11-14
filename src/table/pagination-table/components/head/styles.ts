import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COMMON_CELL_STYLING } from "../../../styling-defaults";

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => !["headerStyle", "isNewHeadCellMenuEnabled"].includes(prop),
})(({ headerStyle, isNewHeadCellMenuEnabled }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer" }),
  pointer: "cursor",
  verticalAlign: "bottom",
  "&:focus": {
    boxShadow: "none",
  },
}));
