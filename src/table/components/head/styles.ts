import styled from '@mui/system/styled';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';

import { COMMON_CELL_STYLING } from '../../constants';

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

export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  lineHeight: '150%',
  pointer: 'cursor',
  borderWidth: '1px 1px 1px 0px',
}));

export const StyledSortLabel = styled(TableSortLabel, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  color: 'inherit',
  '&:hover': {
    color: 'inherit',
  },
  '&.Mui-active': {
    color: 'inherit',
  },
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
