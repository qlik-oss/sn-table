import styled from '@mui/system/styled';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { cellCommon } from '../styles';

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
  borderWidth: '0px 1px 1px 0px',
});

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
