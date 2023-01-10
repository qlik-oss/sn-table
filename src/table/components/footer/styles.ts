import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { PAGINATION_HEIGHT } from '../../constants';

// ---------- FooterWrapper ----------

export const StyledFooterWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'footerStyle',
})(({ footerStyle, theme }) => ({
  height: PAGINATION_HEIGHT,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 0, 1),
  borderTop: `1px solid ${footerStyle.borderColor}`,
  color: footerStyle.color,
  backgroundColor: footerStyle.backgroundColor,
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== 'footerStyle',
})(({ footerStyle, theme }) => ({
  backgroundColor: 'inherit',
  marginRight: theme.spacing(1),
  '& .MuiNativeSelect-icon, .MuiNativeSelect-select': { color: footerStyle.iconColor },
}));

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'disabledCondition' && prop !== 'footerStyle',
})(({ disabledCondition, footerStyle, theme }) => ({
  color: disabledCondition ? footerStyle.disabledIconColor : footerStyle.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  marginLeft: theme.spacing(1),
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  margin: theme.spacing(0, 1, 0, 1),
}));
