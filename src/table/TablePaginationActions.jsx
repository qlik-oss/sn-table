import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)',
  },
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.ceil(count / rowsPerPage) - 1);
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      <IconButton
        onClick={!onFirstPage && handleFirstPageButtonClick}
        aria-disabled={onFirstPage}
        aria-label="first page"
        title="First page"
        className={onFirstPage && classes.disabled}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={!onFirstPage && handleBackButtonClick}
        aria-disabled={onFirstPage}
        aria-label="previous page"
        title="Previous page"
        className={onFirstPage && classes.disabled}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={!onLastPage && handleNextButtonClick}
        aria-disabled={onLastPage}
        aria-label="next page"
        title="Next page"
        className={onLastPage && classes.disabled}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={!onLastPage && handleLastPageButtonClick}
        aria-disabled={onLastPage}
        aria-label="last page"
        title="Last page"
        className={onLastPage && classes.disabled}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
