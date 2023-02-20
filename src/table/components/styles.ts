import styled from '@mui/system/styled';
import Box from '@mui/material/Box';

// ---------- TableWrapper ----------

export const StyledTableWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'background',
})(({ background }) => ({
  height: '100%',
  // TODO: see if we really need this or if we can use background.color
  background: background.tableColorFromTheme,
}));

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
