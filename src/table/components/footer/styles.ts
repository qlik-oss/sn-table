import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { PAGINATION_HEIGHT } from '../../constants';

// ---------- FooterWrapper ----------

export const StyledFooterWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'footerStyle' && prop !== 'withoutBorders',
})(({ footerStyle, theme, withoutBorders }) => ({
  height: PAGINATION_HEIGHT,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 0, 1),
  color: footerStyle.color,
  background: footerStyle.background,
  ...(withoutBorders ? { borderWidth: '0px' } : { borderTop: `1px solid ${footerStyle.borderColor}` }),
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== 'color',
})(({ color, theme }) => ({
  background: 'inherit',
  marginRight: theme.spacing(1),
  '& .MuiNativeSelect-icon, .MuiNativeSelect-select': { color },
}));

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'disabledCondition' && prop !== 'footerStyle',
})(({ disabledCondition, footerStyle, theme }) => ({
  color: disabledCondition ? footerStyle.disabledColor : footerStyle.color,
  cursor: disabledCondition ? 'default' : 'pointer',
  marginLeft: theme.spacing(1),
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  margin: theme.spacing(0, 1, 0, 1),
}));
