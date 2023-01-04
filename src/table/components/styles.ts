import styled from '@mui/system/styled';
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

export const StyledTableWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'background',
})(({ background }) => ({
  height: '100%',
  // TODO: see if we really need this or if we can use background.color
  backgroundColor: background.tableColorFromTheme,
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
  margin: '0px 8px',
  lineHeight: 'calc(4/3)',
  fontSize: 'inherit',
});
