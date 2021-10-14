
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import React from 'react';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles } from '@material-ui/core/styles';
import { focusConfirmButton } from './cells/handle-cell-focus';

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    paddingLeft: '24px',
    transform: 'translate(0px, 4px)',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)',
    cursor: 'default',
  },
  caption: {
    fontSize: '14px',
    color: 'inherit',
    width: 'fit-content',
    position: 'relative',
    transform: 'translate(0px, 14px)',
    paddingRight: '8px',
    height: '30px'
  },
  formControl: {
    flexDirection: 'row',
  },
  hidden: {
    display: 'none'
  },
  dropdown: {
    cursor: 'pointer',
    minWidth: '16px',
    maxHeight: '32px',
    transform: 'translate(0px, 6px)',
  },
  input: {
    padding: '6px 32px 7px 8px'
  }
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange, keyboardActive, tableWidth, translator, isInSelectionMode } = props;

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
      focusConfirmButton(event.target);
    }
  };

  const handleSelectPage = (event) => {
    onPageChange(event, parseInt(event.target.value));
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  const options = [];
  for(let i = 0; i < Math.ceil(count / rowsPerPage); i++){
    options.push({value: i, label: i+1})
  }

  const thinTable = tableWidth < 650;

  return (
    <div className={classes.root}>
      <FormControl className={`${classes.formControl} ${thinTable && classes.hidden}`}>
        <InputLabel className={classes.caption} htmlFor="pagination-dropdown">{translator.get('SNTable.Pagination.SelectPage')}: </InputLabel>
        <Select
          native
          className={classes.dropdown}
          id="pagination-dropdown"
          value={page}
          onChange={handleSelectPage}
          label="Page"
          inputProps={{
            tabindex: keyboardActive,
            name: 'Page',
            id: 'pagination-dropdown',
            className: classes.input,
          }}
        >
          {options.map(value => {
            return <option value={value.value}>{value.label}</option>
          })}
        </Select>
      </FormControl>
      {tableWidth > 350 && (
      <IconButton 
        onClick={!onFirstPage && handleFirstPageButtonClick}
        aria-disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.FirstPage')}
        title={translator.get('SNTable.Pagination.FirstPage')}
        tabindex={keyboardActive}
        className={onFirstPage && classes.disabled}
      >
        <FirstPageIcon />
      </IconButton>)}
      <IconButton 
        onClick={!onFirstPage && handleBackButtonClick}
        aria-disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.PreviousPage')}
        title={translator.get('SNTable.Pagination.PreviousPage')}
        tabindex={keyboardActive}
        className={onFirstPage && classes.disabled}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={!onLastPage ? handleNextButtonClick : () => {}}
        aria-disabled={onLastPage}
        aria-label={translator.get('SNTable.Pagination.NextPage')}
        title={translator.get('SNTable.Pagination.NextPage')}
        tabindex={keyboardActive}
        className={onLastPage && classes.disabled}
        onKeyDown={tableWidth <= 350 && lastPageTabHandle}
      >
        <KeyboardArrowRight />
      </IconButton>
      {tableWidth > 350 && (
        <IconButton
          onClick={!onLastPage ? handleLastPageButtonClick : () => {}}
          aria-disabled={onLastPage}
          aria-label={translator.get('SNTable.Pagination.LastPage')}
          title={translator.get('SNTable.Pagination.LastPage')}
          tabindex={keyboardActive}
          className={onLastPage && classes.disabled}
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
  keyboardActive: PropTypes.bool.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
