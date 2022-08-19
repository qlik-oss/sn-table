import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';

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
  '& .MuiNativeSelect-icon': { color: paginationTheme.iconColor },
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'disabledCondition' && prop !== 'paginationTheme',
})(({ disabledCondition, paginationTheme }) => ({
  color: disabledCondition ? paginationTheme.disabledIconColor : paginationTheme.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  height: '32px',
}));

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
  },
}));

export const StyledBodyRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => prop !== 'bodyCellStyle',
})(({ hover, bodyCellStyle }) =>
  hover
    ? {
        '&&:hover': {
          '& td:not(.selected), th:not(.selected)': {
            backgroundColor: bodyCellStyle.hoverBackgroundColor,
            color: bodyCellStyle.hoverFontColor,
          },
        },
      }
    : {}
);

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

export const StyledSortLabel = styled(TableSortLabel, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
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
  shouldForwardProp: (prop: string) => prop !== 'isTop' && prop !== 'headRowHeight' && prop !== 'totalsStyle',
})(({ totalsStyle, isTop, headRowHeight }) => ({
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
}));
