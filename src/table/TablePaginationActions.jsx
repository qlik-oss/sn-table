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
    display: 'flex',
  },
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange, keyboardActive, translator } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.ceil(count / rowsPerPage) - 1);
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.FirstPage')}
        title={translator.get('SNTable.Pagination.FirstPage')}
        tabindex={keyboardActive}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.PreviousPage')}
        title={translator.get('SNTable.Pagination.PreviousPage')}
        tabindex={keyboardActive}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={onLastPage}
        aria-label={translator.get('SNTable.Pagination.NextPage')}
        title={translator.get('SNTable.Pagination.NextPage')}
        tabindex={keyboardActive}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={onLastPage}
        aria-label={translator.get('SNTable.Pagination.LastPage')}
        title={translator.get('SNTable.Pagination.LastPage')}
        tabindex={keyboardActive}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  keyboardActive: PropTypes.bool.isRequired,
  translator: PropTypes.object.isRequired,
};
