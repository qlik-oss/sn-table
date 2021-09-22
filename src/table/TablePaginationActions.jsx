
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
    paddingLeft: '24px',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)'
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
  }
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { width, count, page, rowsPerPage, onChangePage } = props;

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

  const handleSelectPage = (event) => {
    onChangePage(event, event.target.value);
  };

  const onFirstPage = page === 0;
  const onLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  const options = [];
  for(let i = 0; i < Math.ceil(count / rowsPerPage); i++){
    if (i !== Math.ceil(count / rowsPerPage)-1) {
      options.push({value: i, label: i*100 + 1 + '-' + (i+1)*100})
    } else {
      options.push({value: i, label: i*100 + 1 + '-' + count})
    }
  }

  const thinTable = width < 666;

  return (
    <div className={classes.root}>
      <FormControl className={`${classes.formControl} ${thinTable && classes.hidden}`}>
        <InputLabel className={classes.caption} htmlFor="pagination-dropdown">Select page: </InputLabel>
        <Select
          native
          className={classes.dropdown}
          id="pagination-dropdown"
          value={page}
          onChange={handleSelectPage}
          label="Page"
          inputProps={{
            name: 'Page',
            id: 'pagination-dropdown',
          }}
        >
          {options.map(value => {
            return <option value={value.value}>{value.label}</option>
          })}
        </Select>
      </FormControl>
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
  width: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};