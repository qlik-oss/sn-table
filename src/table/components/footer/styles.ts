import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { PAGINATION_HEIGHT } from "../../constants";

// ---------- FooterWrapper ----------

export const StyledFooterWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== "footerStyle",
})(({ footerStyle, theme }) => ({
  height: PAGINATION_HEIGHT,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: theme.spacing(0, 1, 0, 1),
  color: footerStyle.color,
  background: footerStyle.background,
  borderTop: `1px solid ${footerStyle.borderColor}`,
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== "footerStyle",
})(({ footerStyle, theme }) => ({
  background: "inherit",
  marginRight: theme.spacing(1),
  color: footerStyle.color,
  "& .MuiNativeSelect-icon, .MuiNativeSelect-select": { color: footerStyle.iconColor },
}));

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== "disabledCondition" && prop !== "footerStyle",
})(({ disabledCondition, footerStyle, theme }) => ({
  color: disabledCondition ? footerStyle.disabledColor : footerStyle.color,
  cursor: disabledCondition ? "default" : "pointer",
  marginLeft: theme.spacing(1),
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "inherit",
  margin: theme.spacing(0, 1, 0, 1),
}));
