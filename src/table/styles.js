import {
  styled,
  Paper,
  TableContainer,
  TableRow,
  TableSortLabel,
  TableBody,
  Select,
  IconButton,
  TableCell,
} from '@mui/material';

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
  shouldForwardProp: (prop) => prop !== 'tableTheme',
})(({ tableTheme, theme }) => ({
  height: 48,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: theme.spacing(1),
  boxShadow: 'none',
  color: tableTheme.pagination.color,
  backgroundColor: tableTheme.backgroundColor,
}));

// ---------- PaginationContent ----------

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'paginationTheme',
})(({ paginationTheme }) => ({
  backgroundColor: 'inherit',
  '& .MuiNativeSelect-icon': { color: paginationTheme.iconColor },
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'disabledCondition' && prop !== 'paginationTheme',
})(({ disabledCondition, paginationTheme }) => ({
  color: disabledCondition ? paginationTheme.disabledIconColor : paginationTheme.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  height: '32px',
}));

// ---------- TableBodyWrapper ----------

export const StyledTableBody = styled(TableBody, {
  shouldForwardProp: (prop) => prop !== 'bodyCellStyle',
})(({ bodyCellStyle }) => ({
  '& td, th': {
    fontSize: bodyCellStyle.fontSize,
    padding: bodyCellStyle.padding,
  },
}));

export const StyledBodyRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'bodyCellStyle',
})(({ hover, bodyCellStyle }) => ({
  '&&:hover': {
    '& td:not(.selected), th:not(.selected)': {
      backgroundColor: hover && bodyCellStyle.hoverBackgroundColor,
      color: hover && bodyCellStyle.hoverFontColor,
    },
  },
  '& :last-child': {
    boxShadow: `inset 1px -1px 0 ${bodyCellStyle.borderColor}, inset -1px 0 0 ${bodyCellStyle.borderColor}`,
  },
}));

// ---------- TableHeadWrapper ----------

export const StyledHeadRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  'th:last-of-type': {
    boxShadow: `inset 1px 1px 0 ${headerStyle.borderColor}, inset -1px -1px 0 ${headerStyle.borderColor}`,
  },
}));

export const StyledSortLabel = styled(TableSortLabel, {
  shouldForwardProp: (prop) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
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

// ---------- TableTotals ----------

export const StyledTotalsCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'isTop' && prop !== 'headRowHeight' && prop !== 'totalsStyle',
})(({ totalsStyle, isTop, headRowHeight }) => ({
  ...totalsStyle,
  fontWeight: 'bold',
  position: 'sticky',
  top: isTop && headRowHeight,
  bottom: !isTop && 0,
}));

export const StyledTotalsRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'totalsStyle',
})(({ totalsStyle }) => ({
  '& :last-child': {
    boxShadow: `inset 1px 0 0 ${totalsStyle.borderColor}, inset -1px -1px 0 ${totalsStyle.borderColor}`,
  },
}));

// ---------- TableWrapper ----------

export const StyledTableWrapper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'tableTheme',
})(({ tableTheme }) => ({
  height: '100%',
  backgroundColor: tableTheme.tableBackgroundColorFromTheme,
  boxShadow: 'none',
  borderRadius: 'unset',
}));

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : 'calc(100% - 49px)',
  overflow: constraints.active ? 'hidden' : 'auto',
}));
