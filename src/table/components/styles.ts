import styled from '@mui/system/styled';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import { PAGINATION_HEIGHT } from '../constants';

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
  shouldForwardProp: (prop: string) => prop !== 'background' && prop !== 'paginationNeeded',
})(({ background, paginationNeeded }) => ({
  borderWidth: paginationNeeded ? '0px 1px 0px' : '0px',
  borderStyle: 'solid',
  borderColor: background.isDark ? '#F2F2F2' : '#D9D9D9',
  height: '100%',
  // TODO: see if we really need this or if we can use background.color
  backgroundColor: background.tableColorFromTheme,
  boxShadow: 'none',
  borderRadius: 'unset',
}));

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop: string) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : `calc(100% - ${PAGINATION_HEIGHT + 2}px)`, // +2 for top and bottom border
  overflow: constraints.active ? 'hidden' : 'auto',
  border: 'none',
}));

// ---------- CellText ----------

export const StyledCellText = styled(Box)({
  borderLeft: '0 !important',
});
