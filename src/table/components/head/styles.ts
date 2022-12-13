import styled from '@mui/system/styled';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { COMMON_CELL_STYLING } from '../../constants';

// ---------- TableHeadWrapper ----------

export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  pointer: 'cursor',
  '&&:hover, &&:focus': {
    '& svg, & button': { opacity: 1 },
  },
}));

export const StyledSortLabel = styled(TableSortLabel, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  color: 'inherit',
  '&:hover': {
    color: 'inherit',
  },
  '&.Mui-active': {
    color: 'inherit',
  },
  '&.Mui-active .MuiTableSortLabel-icon': {
    color: headerStyle.sortLabelColor,
  },
  '& .MuiTableSortLabel-iconDirectionDesc': {
    transform: 'rotate(0deg)',
  },
}));

export const VisuallyHidden = styled('span')({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  top: 20,
  width: 1,
});

export const HeadCellContent = styled(Box)({
  display: 'flex',
  flexDirection: 'inherit',
  justifyContent: 'space-between',
});

export const StyledMenuIconButton = styled(Button)({
  opacity: 0,
  '&:focus': {
    opacity: 1,
  },
});

export const StyledCellMenu = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  '.MuiPaper-root': {
    width: '220px',
  },
  '.MuiListItemText-primary, .MuiSvgIcon-root': {
    fontSize: '16px',
    color: headerStyle.sortLabelColor,
  },
  '.head-cell-menu': {
    color: headerStyle.sortLabelColor,
  },
}));
