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
  borderStyle: 'solid',
  borderWidth: '0px 0px 1px 0px',
  borderRadius: 0,
  borderColor: tableTheme.pagination.borderColor,
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
  shouldForwardProp: (prop) => prop !== 'paginationNeeded' && prop !== 'bodyCellStyle',
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
  shouldForwardProp: (prop) => prop !== 'bodyCellStyle',
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
  shouldForwardProp: (prop) => prop !== 'paginationNeeded',
})(({ paginationNeeded }) => ({
  '& :last-child': {
    borderRight: paginationNeeded && 0,
  },
  'th:first-of-type': {
    borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
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

export const TotalsCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'headerStyle' && prop !== 'isTop' && prop !== 'bodyCellStyle',
})(({ headerStyle, bodyCellStyle, isTop }) => {
  return {
    ...bodyCellStyle,
    position: 'sticky',
    backgroundColor: headerStyle.backgroundColor,
    fontWeight: 'bold',
    borderWidth: isTop ? '0px 1px 2px 0px' : '2px 1px 1px 0px',
    boxShadow: isTop ? '0px 3px 5px -5px #a6a6a6' : '3px 0px 5px -5px #a6a6a6',
    top: isTop && 35,
    bottom: !isTop && 0,
  };
});

// ---------- TableWrapper ----------

export const StyledTableWrapper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'tableTheme' && prop !== 'paginationNeeded',
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
  shouldForwardProp: (prop) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : 'calc(100% - 49px)',
  overflow: constraints.active ? 'hidden' : 'auto',
}));
