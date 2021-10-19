import React, { useState, useEffect } from 'react';
import { SN_TABLE_EVENT_TYPES, uniqHash } from './constants';

import useStyles from './styles';

const Announcer = ({ tableRef }) => {
  const styles = useStyles();
  const [notation, setNotation] = useState('');
  const [announceType, setAnnounceType] = useState('assertive');
  const [isAnnouncmentAtomic, setIsAnnouncmentAtomic] = useState(false);

  useEffect(() => {
    window.addEventListener(SN_TABLE_EVENT_TYPES.EMIT_ANNOUNCEMENT, handleAnnouncment);
    return () => {
      window.removeEventListener(SN_TABLE_EVENT_TYPES.EMIT_ANNOUNCEMENT, handleAnnouncment);
    };
  }, []);

  const handleAnnouncment = (evt) => {
    if (!tableRef.current.contains(evt.target)) return;

    console.log('<Announcer />:', evt.detail.message);

    setNotation(evt.detail.message);
    setAnnounceType(evt.detail.politness);
    setIsAnnouncmentAtomic(evt.detail.shouldBeAtomic);
  };

  return (
    <div
      id={`sn-table-announcer--${uniqHash}`}
      aria-live={announceType}
      aria-atomic={isAnnouncmentAtomic}
      className={styles.screenReaderOnly}
    >
      {notation}
    </div>
  );
};

export default Announcer;
