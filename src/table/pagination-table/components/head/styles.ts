import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { COMMON_CELL_STYLING } from "../../../styling-defaults";

const { height, ...REST_COMMON_CELL_STYLING } = COMMON_CELL_STYLING;

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => !["headerStyle", "isNewHeadCellMenuEnabled"].includes(prop),
})(({ headerStyle, isNewHeadCellMenuEnabled }) => ({
  ...REST_COMMON_CELL_STYLING,
  ...headerStyle,
  ...(isNewHeadCellMenuEnabled && { cursor: "pointer" }),
  padding: 0,
  pointer: "cursor",
  "&:focus": {
    boxShadow: "none",
  },
}));
