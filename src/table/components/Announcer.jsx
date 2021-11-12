import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  screenReaderOnly: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});

const Announcer = () => {
  const classes = useStyles();

  return (
    <>
      <div id="sn-table-announcer--01" aria-live="polite" aria-atomic="true" className={classes.screenReaderOnly} />
      <div id="sn-table-announcer--02" aria-live="polite" aria-atomic="true" className={classes.screenReaderOnly} />
    </>
  );
};

export default Announcer;
