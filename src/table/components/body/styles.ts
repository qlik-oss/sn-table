import styled from '@mui/system/styled';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { COMMON_CELL_STYLING } from '../../constants';

// ---------- TableBodyWrapper ----------

export const StyledBodyRow = styled(TableRow, {
  shouldForwardProp: (prop: string) => prop !== 'hoverColors' && prop !== 'hover',
})(({ hover, hoverColors }) => ({
  '&&:hover': {
    background: 'none',
  },
  ...(hover && {
    '&&:hover': {
      '& td:not(.selected), th:not(.selected)': {
        backgroundColor: hoverColors.hoverBackgroundColor,
        color: hoverColors.hoverFontColor,
      },
    },
  }),
}));

export const StyledBodyCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'cellStyle',
})(({ cellStyle, theme }) => ({
  ...COMMON_CELL_STYLING,
  ...cellStyle,
  padding: theme.spacing(0.5, 1.5),
}));

// ---------- TableTotals ----------

export const StyledTotalsCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'isTop' && prop !== 'headRowHeight' && prop !== 'totalsStyle',
})(({ totalsStyle, isTop, headRowHeight, theme }) => ({
  ...COMMON_CELL_STYLING,
  ...totalsStyle,
  fontWeight: 'bold',
  position: 'sticky',
  padding: theme.spacing(0.5, 1.5),
  borderWidth: isTop ? '0px 1px 1px 0px' : '1px 1px 1px 0px',
  top: isTop && headRowHeight,
  bottom: !isTop && 0,
}));
