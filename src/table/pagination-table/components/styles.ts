import styled from '@mui/system/styled';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import { PAGINATION_HEIGHT } from '../../constants';
import { BORDER_WIDTH, COLORING } from '../../styling-defaults';

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

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop: string) => prop !== 'fullHeight' && prop !== 'constraints',
})(({ fullHeight, constraints }) => ({
  height: fullHeight ? '100%' : `calc(100% - ${PAGINATION_HEIGHT + BORDER_WIDTH}px)`,
  overflow: constraints.active ? 'hidden' : 'auto',
  border: 'none',
}));

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop: string) => prop !== 'customWidth' && prop !== 'isBorderRight',
})(({ customWidth, isBorderRight }) =>
  customWidth
    ? {
        tableLayout: 'fixed',
        width: 'min-content',
        borderWidth: isBorderRight && '0px 1px 0px 0px',
        borderStyle: isBorderRight && 'solid',
        borderColor: COLORING.BORDER_MEDIUM,
      }
    : {}
);
