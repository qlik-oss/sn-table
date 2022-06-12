import { styled, Paper, TableContainer, TableRow, TableSortLabel, TableBody, Select, IconButton } from '@mui/material';
import { stardust } from '@nebula.js/stardust';

import { Table } from '../types';

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
interface StyledFooterWrapperProps {}
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
interface StyledSelectProps {}
export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'paginationTheme',
})(({ paginationTheme }) => ({
  backgroundColor: 'inherit',
  '& .MuiNativeSelect-icon': { color: paginationTheme.iconColor },
}));

interface StyledIconButtonProps {}
export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'disabledCondition' && prop !== 'paginationTheme',
})(({ disabledCondition, paginationTheme }) => ({
  color: disabledCondition ? paginationTheme.disabledIconColor : paginationTheme.iconColor,
  cursor: disabledCondition ? 'default' : 'pointer',
  height: '32px',
}));

// ---------- TableBodyWrapper ----------
interface StyledTableBodyProps {}
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

interface StyledBodyRowProps {}
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
interface StyledTableHeaProps {}
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

interface StyledSortLabelProps {}
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

// ---------- TableWrapper ----------
interface StyledTableWrapperProps {
  tableTheme: Table;
  paginationNeeded: boolean;
}
export const StyledTableWrapper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'tableTheme' && prop !== 'paginationNeeded',
})(({ tableTheme, paginationNeeded }: StyledTableWrapperProps) => ({
  borderWidth: paginationNeeded ? '0px 1px 0px' : '0px',
  borderStyle: 'solid',
  borderColor: tableTheme.borderColor,
  height: '100%',
  backgroundColor: tableTheme.tableBackgroundColorFromTheme,
  boxShadow: 'none',
  borderRadius: 'unset',
}));

interface StyledTableContainerProps {
  fullHeight: boolean;
  constraints: stardust.Constraints;
}
export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }: StyledTableContainerProps) => ({
  height: fullHeight ? '100%' : 'calc(100% - 49px)',
  overflow: constraints.active ? 'hidden' : 'auto',
}));
