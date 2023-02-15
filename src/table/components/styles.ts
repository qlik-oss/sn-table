import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import { PAGINATION_HEIGHT } from '../constants';
import { BORDER_WIDTH } from '../styling-defaults';

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
  background: background.tableColorFromTheme,
}));

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop: string) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : `calc(100% - ${PAGINATION_HEIGHT + BORDER_WIDTH}px)`,
  overflow: constraints.active ? 'hidden' : 'auto',
  border: 'none',
}));

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop: string) => prop !== 'customWidth',
})(({ customWidth }) =>
  customWidth
    ? {
        tableLayout: 'fixed',
        width: 'min-content',
      }
    : {}
);

// ---------- CellText ----------

export const StyledCellText = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'style' && prop !== 'singleLine',
})(({ style, singleLine }) => ({
  ...style,
  lineHeight: 'calc(4/3)',
  fontSize: 'inherit',
  ...(singleLine && {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
}));

export const StyledCellTextWrapper = styled(Box)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
