import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';

// ---------- Common ----------

export const cellCommon = {
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

// ---------- CellText ----------

export const StyledCellText = styled(Box)({
  borderLeft: '0 !important',
});
