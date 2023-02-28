import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import { BORDER_WIDTH, DEFAULT_FONT_SIZE, PADDING } from '../../styling-defaults';

// ---------- HeadCellContent ----------

export const StyledSortButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isActive' && prop !== 'textAlign',
})(({ isActive, textAlign, theme }) => ({
  textAlign,
  height: 'auto',
  fontSize: 'inherit',
  padding: theme.spacing(0.5, 1),
  color: 'inherit',
  alignItems: 'flex-end',
  '&&:focus, &&:hover': {
    '& svg': {
      opacity: isActive ? 1 : 0.5,
    },
  },
  '& svg': {
    opacity: isActive ? 1 : 0,
    fontSize: DEFAULT_FONT_SIZE,
  },
  '& .MuiButton-endIcon, .MuiButton-startIcon': {
    marginBottom: '2px',
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
  justifyContent: 'space-between',
  flexDirection: 'inherit',
  alignItems: 'flex-end',
  gap: theme.spacing(0.5),
  fontSize: 'inherit',
  '&&:hover, &&:focus-within': {
    '& #sn-table-head-menu-button': { opacity: 1 },
  },
}));

export const LockWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  width: '20px',
  height: '18px',
  flexShrink: 0,
  flexDirection: 'inherit',
});

// ---------- HeadCellMenu ----------
export const HeadCellMenuWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'isVisible' && prop !== 'rightAligned',
})(({ rightAligned }) => ({
  ...(rightAligned ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
}));

export const StyledMenuIconButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isVisible' && prop !== 'rightAligned',
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
  display: 'flex',
  justifyContent: 'space-between',
}));

export const StyledMenuItemLabel = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

// ---------- ColumnAdjuster ----------

export const AdjusterHitArea = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'isLastColumn',
})(({ isLastColumn }) => ({
  display: 'flex',
  position: 'absolute',
  height: '100%',
  top: 0,
  left: `100%`,
  cursor: 'col-resize',
  // last column padding, other double padding + border
  width: `${isLastColumn ? PADDING : PADDING * 2 + BORDER_WIDTH}px`,
  justifyContent: isLastColumn ? 'flex-end' : 'center',
  marginLeft: '-4px',
  '&&:hover': {
    '& .sn-table-adjuster-head-border': {
      background: '#D9D9D9',
    },
  },
  '&&:active': {
    '& .sn-table-adjuster-head-border, .sn-table-adjuster-body-border': {
      background: '#177fe6',
    },
  },
}));

export const AdjusterHeadBorder = styled(Box)({
  position: 'absolute',
  height: '100%',
  width: '3px',
});

export const AdjusterBodyBorder = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'borderHeight',
})(({ borderHeight }) => ({
  position: 'absolute',
  height: borderHeight,
  width: '1px',
}));
