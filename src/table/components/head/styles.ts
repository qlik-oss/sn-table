import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import { BORDER_WIDTH, DEFAULT_FONT_SIZE, PADDING } from '../../styling-defaults';
import { HEAD_ICON_WRAPPER_SIZE, LOCK_ICON_SIZE } from '../../constants';

// ---------- HeadCellContent ----------

export const StyledSortButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isActive' && prop !== 'textAlign' && prop !== 'disabled',
})(({ isActive, textAlign, disabled, theme }) => ({
  textAlign,
  height: 'auto',
  maxWidth: '100%',
  fontSize: 'inherit',
  padding: theme.spacing(0.5, 1),
  color: 'inherit',
  alignItems: 'flex-end',
  cursor: disabled ? 'auto' : 'pointer',
  justifySelf: textAlign,
  '&&:focus, &&:hover': {
    '& svg': {
      opacity: isActive ? 1 : 0.5,
    },
  },
  '& svg': {
    opacity: isActive ? 1 : 0,
    fontSize: DEFAULT_FONT_SIZE,
  },
  '& .Mui-disabled': {
    color: 'inherit',
  },
  '& .MuiButton-endIcon, .MuiButton-startIcon': {
    marginBottom: '2px',
    visibility: disabled ? 'hidden' : 'visible',
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

export const StyledHeadCellContent = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'isLocked',
})(({ theme, isLocked }) => ({
  width: '100%',
  display: 'grid',
  flexDirection: 'inherit',
  gridAutoFlow: 'dense',
  gap: theme.spacing(0.5),
  fontSize: 'inherit',
  '&&:hover, &&:focus-within': {
    '& #sn-table-head-menu-button': { opacity: 1 },
  },

  '& > div:last-child': { alignSelf: 'flex-end' },

  '&.aligned-left': {
    gridTemplateColumns: isLocked
      ? `${LOCK_ICON_SIZE}px 2fr ${HEAD_ICON_WRAPPER_SIZE}px`
      : `1fr ${HEAD_ICON_WRAPPER_SIZE}px`,
  },

  '&.aligned-center': {
    gridTemplateColumns: `${HEAD_ICON_WRAPPER_SIZE}px 2fr ${HEAD_ICON_WRAPPER_SIZE}px`,

    '& > div:first-child': { gridColumn: 1 },
    '& .sn-table-head-label': { gridColumn: 2 },
    '& > div:last-child': { gridColumn: 3 },
  },

  '&.aligned-right': {
    gridTemplateColumns: isLocked
      ? `${HEAD_ICON_WRAPPER_SIZE}px 2fr ${LOCK_ICON_SIZE}px`
      : `${HEAD_ICON_WRAPPER_SIZE}px 1fr`,

    '& > div:first-child': { gridColumn: isLocked ? 3 : 'unset' },
    '& .sn-table-head-label': { gridColumn: 2 },
    '& > div:last-child': { gridColumn: 1 },
  },
}));

export const StyledHeadCellIconWrapper = styled('div')({
  display: 'flex',
  alignSelf: 'flex-end',
});

export const LockWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: `${LOCK_ICON_SIZE}px`,
  height: `${HEAD_ICON_WRAPPER_SIZE}px`,
  flexShrink: 0,
  flexDirection: 'inherit',

  '&.aligned-right': { justifyContent: 'flex-start' },
  '&.aligned-center, &.aligned-left': { justifyContent: 'flex-end' },
});

// ---------- HeadCellMenu ----------
export const HeadCellMenuWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'isVisible' && prop !== 'rightAligned',
})(({ rightAligned }) => ({
  ...(rightAligned ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
  height: `${HEAD_ICON_WRAPPER_SIZE}px`,
  display: 'flex',
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
  '&&:focus': {
    boxShadow: 'rgb(23, 127, 230) 0px 0px 0px 2px',
  },
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
  '&&:hover:not(:focus, :active)': {
    '& .sn-table-adjuster-head-border': {
      background: '#D9D9D9',
    },
  },
  '&&:focus, :active': {
    '& .sn-table-adjuster-head-border': {
      background: '#177fe6',
    },
  },
  '&&:focus-visible': {
    outline: 'none',
  },
}));

export const AdjusterHeadBorder = styled(Box)({
  position: 'absolute',
  height: '100%',
  width: '3px',
});
