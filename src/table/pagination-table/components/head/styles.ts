import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COMMON_CELL_STYLING } from '../../../styling-defaults';

// eslint-disable-next-line import/prefer-default-export
export const StyledHeadCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'headerStyle',
})(({ headerStyle }) => ({
  ...COMMON_CELL_STYLING,
  ...headerStyle,
  pointer: 'cursor',
  verticalAlign: 'bottom',
  '&:focus': {
    boxShadow: 'none',
  },
}));
