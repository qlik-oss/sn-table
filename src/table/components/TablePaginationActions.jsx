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
import { handleLastTab } from '../utils/handle-key-press';

const useStyles = makeStyles({
  root: {
    paddingLeft: '12px',
    flexShrink: 0,
    display: 'flex',
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caption: {
    fontSize: '14px',
    color: 'inherit',
    width: 'fit-content',
    position: 'relative',
    padding: '8px',
    transform: 'none',
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
  hidden: {
    display: 'none',
  },
  dropdown: {
    cursor: 'pointer',
    minWidth: '16px',
    maxHeight: '32px',
  },
  input: {
    padding: '6px 32px 7px 8px',
  },
});

const icons = {
  FirstPage: FirstPageIcon,
  PreviousPage: KeyboardArrowLeft,
  NextPage: KeyboardArrowRight,
  LastPage: LastPageIcon,
};

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { page, lastPageIdx, onPageChange, keyboard, tableWidth, translator, isInSelectionMode } = props;
  const onFirstPage = page === 0;
  const onLastPage = page >= lastPageIdx;
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const showFirstLast = tableWidth > 350;

  const handleSelectPage = (event) => onPageChange(+event.target.value);
  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, isInSelectionMode) : null;

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    const IconComponent = icons[type];
    return (
      <IconButton
        onClick={!disabledCondition ? () => onPageChange(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={translator.get(`SNTable.Pagination.${type}`)}
        tabIndex={tabIndex}
        className={`${classes.paginationActionButton} ${disabledCondition && classes.disabled}`}
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </IconButton>
    );
  };

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
            {Array(lastPageIdx + 1)
              .fill()
              .map((_, index) => (
                <option key={String(index)} value={index}>
                  {index + 1}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {showFirstLast && getButton(onFirstPage, 0, 'FirstPage')}
      {getButton(onFirstPage, page - 1, 'PreviousPage')}
      {getButton(onLastPage, page + 1, 'NextPage', !showFirstLast ? handleLastButtonTab : null)}
      {showFirstLast && getButton(onLastPage, lastPageIdx, 'LastPage', handleLastButtonTab)}
    </div>
  );
}

TablePaginationActions.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  lastPageIdx: PropTypes.number.isRequired,
  keyboard: PropTypes.object.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
