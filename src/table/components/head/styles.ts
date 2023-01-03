import styled from '@mui/system/styled';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import { COMMON_CELL_STYLING } from '../../constants';

// ---------- TableHeadWrapper ----------

export const StyledHeadRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => prop !== 'paginationNeeded',
})(({ paginationNeeded }) => ({
  '& :last-child': {
    borderRight: paginationNeeded && 0,
  },
  'th:first-of-type': {
    borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
  },
}));

export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  lineHeight: '150%',
  pointer: 'cursor',
  borderWidth: '1px 1px 1px 0px',
  '&&:hover, &&:focus': {
    '& button, & svg': { opacity: 1 },
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

export const StyledMenuIconButton = styled(IconButton)({
  opacity: 0,
  minWidth: '30px',
  padding: '4px',
  radius: '3px',
  '&:focus': {
    opacity: 1,
  },
});

export const StyledCellMenu = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle, theme }) => ({
  '.MuiPaper-root': {
    width: '210px',
    // backgroundColor: 'unset',
    borderRadius: theme.spacing(1),
  },
  '.MuiListItemText-primary, .MuiSvgIcon-root': {
    fontSize: '16px',
    color: headerStyle.sortLabelColor,
  },
  '.head-cell-menu': {
    color: headerStyle.sortLabelColor,
  },
}));

export const PrimaryDropdownPaper = styled(Paper)(({ theme }) => ({
  '.sn-table-head-menu': {
    backgroundColor: theme.palette.common.white,
    // borderRadius: theme.spacing(0.75),
    border: `1px solid ${theme.palette.grey[200]}`,
    padding: 0,
  },

  // '& li:first-child > div': {
  //   marginTop: theme.spacing(0.76),
  // },

  // '& li:last-child > div': {
  //   marginBottom: theme.spacing(0.76),
  // },

  // '.sn-table-head-menu-item-button': {
  //   margin: theme.spacing(0.38, 0.76),
  //   borderRadius: theme.spacing(0.5),
  //   height: theme.spacing(4.5),
  //   position: 'relative',

  //   '::before': {
  //     content: '""',
  //     height: '75%',
  //     width: theme.spacing(0.5),
  //     position: 'absolute',
  //     left: 0,
  //     opacity: 0,
  //     borderRadius: theme.spacing(0, 0.4, 0.4, 0),
  //     backgroundColor: theme.palette.primary.light,
  //     transition: theme.transitions.create(['opacity'], {
  //       duration: theme.transitions.duration.standard,
  //     }),
  //   },

  //   '&:hover::before': {
  //     opacity: 1,
  //   },
  // },
}));

export const MenuListDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

export const NebulaListBox = styled('div')(({ theme }) => ({
  height: '350px',
  boxSizing: 'border-box',
  background: theme.palette.common.white,
}));
