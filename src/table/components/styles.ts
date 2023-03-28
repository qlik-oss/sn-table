import { styled } from '@mui/material/styles';
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
  shouldForwardProp: (prop: string) => prop !== 'lines' && prop !== 'wordBreak' && prop !== 'width',
})(({ lines, wordBreak, width }) => ({
  lineHeight: 'calc(4/3)',
  fontSize: 'inherit',
  ...(width && { width: `${width}px` }),
  ...(wordBreak && {
    height: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all', // break-all as the line height logic does not account for word breaks at reasonable places like a white space
    display: '-webkit-box', // -webkit-box, -webkit-line-clamp and -webkit-box-orient enables support for ellipsis on multiple lines
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  }),
}));

export const StyledCellTextWrapper = styled(Box)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
