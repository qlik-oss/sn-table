import React from 'react';
import Box from '@mui/material/Box';

export default function CellText({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" className="sn-table-cell-text" sx={{ borderLeft: '0 !important' }}>
      {children}
    </Box>
  );
}
