import React from 'react';
import Box from '@mui/material/Box';
import { useContextSelector, TableContext } from '../context';

interface AdjusterProps {
  rootElement: HTMLElement;
}

function ColumnAdjuster({ rootElement }: AdjusterProps) {
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const dragPositions = [...columnWidths];
  const headRowHeight = useContextSelector(TableContext, (value) => value.headRowHeight);
  dragPositions.pop();

  return (
    <Box sx={{ width: `${columnWidths.reduce((a, b) => a + b, 0)}%`, height: headRowHeight, position: 'absolute' }}>
      {dragPositions.map((c, i) => {
        const left = dragPositions.slice(0, i + 1).reduce((a, b) => a + b, 0);
        return (
          <Box
            key={`adjuster-${i}`}
            sx={{
              left: `${left}%`,
              marginLeft: '-4px',
              height: headRowHeight,
              width: '8px',
              background: 'red',
              opacity: 0.5,
              position: 'absolute',
              zIndex: 3,
              cursor: 'col-resize',
            }}
          />
        );
      })}
    </Box>
  );
}
export default ColumnAdjuster;
