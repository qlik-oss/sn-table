import styled from '@mui/system/styled';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import { COMMON_CELL_STYLING } from '../../styling-defaults';

// ---------- TableHeadWrapper ----------

export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  pointer: 'cursor',
}));

export const StyledSortButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isActive',
})(({ isActive, theme }) => ({
  padding: theme.spacing(0.5, 1),
  color: 'inherit',
  '&&:focus, &&:hover': {
    '& svg': {
      opacity: isActive ? 1 : 0.5,
    },
  },
  '& svg': {
    opacity: isActive ? 1 : 0,
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

export const StyledHeadCellContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'inherit',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&&:hover, &&:focus-within': {
    '& #sn-table-head-menu-button': { opacity: 1 },
  },
}));

export const LockAndLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'inherit',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// ---------- HeadCellMenu ----------

export const StyledMenuIconButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isVisible',
})(({ isVisible }) => ({
  opacity: isVisible ? 1 : 0,
  '&:focus': {
    opacity: 1,
  },
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  '&.MuiDivider-root': {
    margin: theme.spacing(0.5),
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '4px',
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1, 1.5),
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  lineHeight: 0,
}));

export const NebulaListBox = styled('div')(({ theme }) => ({
  height: '350px',
  boxSizing: 'border-box',
  background: theme.palette.common.white,
}));
