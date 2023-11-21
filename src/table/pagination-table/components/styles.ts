import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { styled } from "@mui/material/styles";
import { PAGINATION_HEIGHT } from "@qlik/nebula-table-utils/lib/constants";
import { BORDER_WIDTH } from "../../styling-defaults";

// ---------- AnnounceWrapper ----------

export const TableAnnouncer = styled("div")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
});

// ---------- TableWrapper ----------

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop: string) => prop !== "fullHeight" && prop !== "interactions",
})(({ fullHeight, interactions }) => ({
  height: fullHeight ? "100%" : `calc(100% - ${PAGINATION_HEIGHT + BORDER_WIDTH}px)`,
  overflow: interactions.active ? "auto" : "hidden",
  border: "none",
}));

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop: string) => prop !== "showRightBorder" && prop !== "styling",
})(({ showRightBorder, styling }) => ({
  tableLayout: "fixed",
  width: "min-content",
  borderRight: showRightBorder ? `1px solid ${styling.body.borderRightColor}` : undefined,
}));
