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
  const { count, page, rowsPerPage, onPageChange, keyboardActive } = props;

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

  const tableButtonsArr = [
    {
      order: 0,
      IconProps: {
        onClick: handleFirstPageButtonClick,
        disabled: onFirstPage,
        'aria-label': 'first page',
        title: 'First Page',
      },
      IconToRender: <FirstPageIcon />,
    },
    {
      order: 1,
      IconProps: {
        onClick: handleBackButtonClick,
        disabled: onFirstPage,
        'aria-label': 'previous page',
        title: 'Previous Page',
      },
      IconToRender: <KeyboardArrowLeft />,
    },
    {
      order: 2,
      IconProps: {
        onClick: handleNextButtonClick,
        disabled: onLastPage,
        'aria-label': 'next page',
        title: 'Next Page',
      },
      IconToRender: <KeyboardArrowRight />,
    },
    {
      order: 3,
      IconProps: {
        onClick: handleLastPageButtonClick,
        disabled: onLastPage,
        'aria-label': 'last page',
        title: 'Last Page',
      },
      IconToRender: <LastPageIcon />,
    },
  ].sort((a, b) => a.order - b.order);

  return (
    <div className={classes.root}>
      {tableButtonsArr.map((btn) => (
        <IconButton key={btn.order} {...btn.IconProps} tabIndex={keyboardActive}>
          {btn.IconToRender}
        </IconButton>
      ))}
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  keyboardActive: PropTypes.bool.isRequired,
};
