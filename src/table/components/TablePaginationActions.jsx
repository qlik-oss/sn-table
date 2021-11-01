import PropTypes from 'prop-types';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { makeStyles } from '@mui/styles';
import { focusSelectionToolbar } from '../utils/handle-accessibility';

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    paddingLeft: '24px',
    transform: 'translate(0px, 4px)',
  },
  paginationActionButton: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)',
    cursor: 'default',
  },
  focused: {
    color: '#404040 !important',
  },
  caption: {
    fontSize: '14px',
    color: 'inherit',
    width: 'fit-content',
    position: 'relative',
    transform: 'translate(0px, 12px)',
    paddingRight: '8px',
    height: '30px',
  },
  formControl: {
    flexDirection: 'row',
  },
  hidden: {
    display: 'none',
  },
  dropdown: {
    cursor: 'pointer',
    minWidth: '16px',
    maxHeight: '32px',
    transform: 'translate(0px, 6px)',
  },
  input: {
    padding: '6px 32px 7px 8px',
  },
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange, keyboard, tableWidth, translator, isInSelectionMode } = props;
  const tabIndex = !keyboard.enabled || keyboard.active ? '0' : '-1';

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

  const lastPageTabHandle = (event) => {
    if (isInSelectionMode && event.key === 'Tab' && !event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();
      focusSelectionToolbar(event.target, keyboard, false);
    }
  };

  const handleSelectPage = (event) => {
    onPageChange(event, parseInt(event.target.value, 10));
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      {tableWidth > 650 && (
        <FormControl className={classes.formControl}>
          <InputLabel
            className={classes.caption}
            htmlFor="pagination-dropdown"
            shrink={false}
            classes={{ focused: classes.focused }}
          >
            {`${translator.get('SNTable.Pagination.SelectPage')}: `}
          </InputLabel>
          <Select
            native
            className={classes.dropdown}
            value={page}
            onChange={handleSelectPage}
            inputProps={{
              'data-testid': 'pagination-dropdown',
              tabIndex,
              id: 'pagination-dropdown',
              className: classes.input,
            }}
          >
            {Array(Math.ceil(count / rowsPerPage))
              .fill()
              .map((val, i) => (
                <option value={i}>{i + 1}</option>
              ))}
          </Select>
        </FormControl>
      )}
      {tableWidth > 350 && (
        <IconButton
          onClick={!onFirstPage ? handleFirstPageButtonClick : null}
          aria-disabled={onFirstPage}
          aria-label={translator.get('SNTable.Pagination.FirstPage')}
          title={translator.get('SNTable.Pagination.FirstPage')}
          tabIndex={tabIndex}
          className={`${classes.paginationActionButton} ${onFirstPage && classes.disabled}`}
        >
          <FirstPageIcon />
        </IconButton>
      )}
      <IconButton
        onClick={!onFirstPage ? handleBackButtonClick : null}
        aria-disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.PreviousPage')}
        title={translator.get('SNTable.Pagination.PreviousPage')}
        tabIndex={tabIndex}
        className={`${classes.paginationActionButton} ${onFirstPage && classes.disabled}`}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={!onLastPage ? handleNextButtonClick : null}
        aria-disabled={onLastPage}
        aria-label={translator.get('SNTable.Pagination.NextPage')}
        title={translator.get('SNTable.Pagination.NextPage')}
        tabIndex={tabIndex}
        className={`${classes.paginationActionButton} ${onLastPage && classes.disabled}`}
        onKeyDown={tableWidth <= 350 ? lastPageTabHandle : null}
      >
        <KeyboardArrowRight />
      </IconButton>
      {tableWidth > 350 && (
        <IconButton
          onClick={!onLastPage ? handleLastPageButtonClick : null}
          aria-disabled={onLastPage}
          aria-label={translator.get('SNTable.Pagination.LastPage')}
          title={translator.get('SNTable.Pagination.LastPage')}
          tabIndex={tabIndex}
          className={`${classes.paginationActionButton} ${onLastPage && classes.disabled}`}
          onKeyDown={lastPageTabHandle}
        >
          <LastPageIcon />
        </IconButton>
      )}
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  keyboard: PropTypes.object.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
