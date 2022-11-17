import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// ---------- Common ----------

const cellCommon = {
  padding: '7px 14px',
  height: 'auto',
  lineHeight: '130%',
  '&:focus': {
    boxShadow: '0 0 0 2px #3f8ab3 inset',
    outline: 'none',
  },
};

// ---------- AnnounceWrapper ----------

export const TableAnnouncer = styled('div')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});

// ---------- FooterWrapper ----------

export const StyledFooterWrapper = styled(Paper, {
  shouldForwardProp: (prop: string) => prop !== 'tableTheme',
})(({ tableTheme, theme }) => ({
  height: 48,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: theme.spacing(1),
  boxShadow: 'none',
  borderStyle: 'solid',
  borderWidth: '0px 0px 1px 0px',
  borderRadius: 0,
  borderColor: tableTheme.pagination.borderColor,
  color: tableTheme.pagination.color,
  backgroundColor: tableTheme.backgroundColor,
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== 'paginationTheme',
})(({ paginationTheme }) => ({
  backgroundColor: 'inherit',
  // padding: '0px 12px',
  '& .MuiNativeSelect-icon': { color: paginationTheme.iconColor },
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'disabledCondition' && prop !== 'paginationTheme',
})(({ disabledCondition, paginationTheme }) => ({
  color: disabledCondition ? paginationTheme.disabledIconColor : paginationTheme.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  height: '32px',
  padding: '0px 7px',
}));

export const StyledInputLabel = styled(InputLabel)({
  fontSize: 14,
  width: 'fit-content',
  position: 'relative',
  padding: 8,
  transform: 'none',
  fontWeight: 400,
});

export const StyledFormControl = styled(FormControl)({
  padding: '0px 20px',
});

// ---------- TableBodyWrapper ----------

export const StyledTableBody = styled(TableBody, {
  shouldForwardProp: (prop: string) => prop !== 'paginationNeeded' && prop !== 'bodyCellStyle',
})(({ paginationNeeded, bodyCellStyle }) => ({
  'tr :last-child': {
    borderRight: paginationNeeded && 0,
  },
  'tr :first-child': {
    borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
  },
  '& td, th': {
    fontSize: bodyCellStyle.fontSize,
    padding: bodyCellStyle.padding,
    userSelect: 'none',
  },
}));

export const StyledBodyRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => prop !== 'bodyCellStyle',
})(({ hover, bodyCellStyle }) => ({
  '&&:hover': {
    background: 'none',
  },
  ...(hover && {
    '&&:hover': {
      '& td:not(.selected), th:not(.selected)': {
        backgroundColor: bodyCellStyle.hoverBackgroundColor,
        color: bodyCellStyle.hoverFontColor,
      },
    },
  }),
}));

export const StyledBodyCell = styled(TableCell)({
  ...cellCommon,
});

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

export const StyledHeadCell = styled(TableCell)({
  ...cellCommon,
  lineHeight: '150%',
  '&&:hover, &&:focus': {
    '& svg, & button': { opacity: 1 },
  },
});

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

// ---------- TableTotals ----------

export const StyledTotalsCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'isTop' && prop !== 'headRowHeight' && prop !== 'totalsStyle',
})(({ totalsStyle, isTop, headRowHeight }) => ({
  ...cellCommon,
  ...totalsStyle,
  fontWeight: 'bold',
  position: 'sticky',
  borderWidth: isTop ? '0px 1px 2px 0px' : '2px 1px 1px 0px',
  top: isTop && headRowHeight,
  bottom: !isTop && 0,
  marginTop: 0,
}));

// ---------- TableWrapper ----------

export const StyledTableWrapper = styled(Paper, {
  shouldForwardProp: (prop: string) => prop !== 'tableTheme' && prop !== 'paginationNeeded',
})(({ tableTheme, paginationNeeded }) => ({
  borderWidth: paginationNeeded ? '0px 1px 0px' : '0px',
  borderStyle: 'solid',
  borderColor: tableTheme.borderColor,
  height: '100%',
  backgroundColor: tableTheme.tableBackgroundColorFromTheme,
  boxShadow: 'none',
  borderRadius: 'unset',
}));

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop: string) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : 'calc(100% - 49px)',
  overflow: constraints.active ? 'hidden' : 'auto',
  border: 'none',
}));
