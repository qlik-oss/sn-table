import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import { COMMON_CELL_STYLING } from "../../../styling-defaults";

// ---------- TableBodyWrapper ----------

export const StyledBody = styled(TableBody, {
  shouldForwardProp: (prop: string) => prop !== "lastRowBottomBorder",
})(({ lastRowBottomBorder }) => ({
  "& tr:last-child": {
    "& td, th": {
      borderBottomWidth: lastRowBottomBorder,
    },
  },
}));

export const StyledBodyRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => prop !== "hoverColors" && prop !== "hover",
})(({ hover, hoverColors }) => ({
  "&&:hover": {
    background: "none",
  },
  ...(hover && {
    "&&:hover": {
      "& td:not(.selected), th:not(.selected)": hoverColors,
    },
  }),
}));

export const StyledBodyCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== "cellStyle",
})(({ cellStyle, theme }) => ({
  ...COMMON_CELL_STYLING,
  ...cellStyle,
  padding: theme.spacing(0.5, 1.5),
}));

// ---------- TableTotals ----------

export const StyledTotalsCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== "atTop" && prop !== "headRowHeight" && prop !== "totalsStyle",
})(({ totalsStyle, atTop, headRowHeight, theme }) => ({
  ...COMMON_CELL_STYLING,
  ...totalsStyle,
  fontWeight: "600",
  position: "sticky",
  padding: theme.spacing(0.5, 1.5),
  borderWidth: atTop ? "0px 1px 1px 0px" : "1px 1px 1px 0px",
  top: atTop && headRowHeight,
  bottom: !atTop && 0,
}));
