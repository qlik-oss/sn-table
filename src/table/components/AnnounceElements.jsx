import React from 'react';
import { styled } from '@mui/system';

const TableAnnouncer = styled('div')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});

const AnnounceElements = () => {
  return (
    <>
      <TableAnnouncer id="sn-table-announcer--01" aria-live="polite" aria-atomic="true" />
      <TableAnnouncer id="sn-table-announcer--02" aria-live="polite" aria-atomic="true" />
    </>
  );
};

export default AnnounceElements;
