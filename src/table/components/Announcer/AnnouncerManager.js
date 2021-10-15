import { useState, useEffect } from 'react';
import { SN_TABLE_EVENT_TYPES } from './constants';

const AnnouncerManager = () => {
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
    console.log('#01', evt);
    // TODO:
    //  - get related notation
    //  - update announcment type
    //  - update atomic type
    //  - make sure this announcement will happen inside of this table
    //    not other tables inside of the sheet! ( scope it properly )
    setNotation(`some announcment ${randomIntFromInterval(1, 100)}`);
    setAnnounceType(evt.detail.announceType);
    setIsAnnouncmentAtomic(evt.detail.shouldBeAtomic);
  };

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return {
    data: { announceType, isAnnouncmentAtomic, notation },
    actions: {},
  };
};

export default AnnouncerManager;
