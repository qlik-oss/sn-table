import React from 'react';
import { TableAnnouncer } from './styles';

const AnnounceElements = () => (
  <>
    <TableAnnouncer className="sn-table-announcer-1" aria-live="polite" aria-atomic="true" />
    <TableAnnouncer className="sn-table-announcer-2" aria-live="polite" aria-atomic="true" />
  </>
);

export default AnnounceElements;
