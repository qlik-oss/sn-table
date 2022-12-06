import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// ---------- FooterWrapper ----------

export const StyledFooterWrapper = styled(Paper, {
  shouldForwardProp: (prop: string) => prop !== 'paginationStyle',
})(({ paginationStyle, theme }) => ({
  height: 48,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: theme.spacing(1),
  boxShadow: 'none',
  borderStyle: 'solid',
  borderWidth: '0px 0px 1px 0px',
  borderRadius: 0,
  borderColor: paginationStyle.borderColor,
  color: paginationStyle.color,
  backgroundColor: paginationStyle.backgroundColor,
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== 'paginationStyle',
})(({ paginationStyle }) => ({
  backgroundColor: 'inherit',
  '& .MuiNativeSelect-icon': { color: paginationStyle.iconColor },
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'disabledCondition' && prop !== 'paginationStyle',
})(({ disabledCondition, paginationStyle }) => ({
  color: disabledCondition ? paginationStyle.disabledIconColor : paginationStyle.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  height: '32px',
  padding: '0px 7px',
}));

export const StyledInputLabel = styled(InputLabel, {
  shouldForwardProp: (prop: string) => prop !== 'color',
})(({ color }) => ({
  color,
  fontSize: 14,
  width: 'fit-content',
  position: 'relative',
  padding: 8,
  transform: 'none',
  fontWeight: 400,
}));

export const StyledFormControl = styled(FormControl)({
  padding: '0px 20px',
});
