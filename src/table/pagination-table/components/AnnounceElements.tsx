import React from 'react';
import { TableAnnouncer } from './styles';

const AnnounceElements = () => (
  <>
    <TableAnnouncer id="sn-table-announcer--01" aria-live="polite" aria-atomic="true" />
    <TableAnnouncer id="sn-table-announcer--02" aria-live="polite" aria-atomic="true" />
  </>
);

export default AnnounceElements;
