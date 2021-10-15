import React from 'react';
import AnnouncerManager from './AnnouncerManager';
import useStyles from './styles';

const Announcer = () => {
  const {
    data: { announceType, isAnnouncmentAtomic, notation },
  } = AnnouncerManager();
  const styles = useStyles();

  return (
    <div
      id="sn-table-announcer"
      aria-live={announceType}
      aria-atomic={isAnnouncmentAtomic}
      className={styles.screenReaderOnly}
    >
      {notation}
    </div>
  );
};

export default Announcer;
