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
import { handleLastTab } from '../utils/handle-key-press';

const icons = {
  FirstPage: FirstPageIcon,
  PreviousPage: KeyboardArrowLeft,
  NextPage: KeyboardArrowRight,
  LastPage: LastPageIcon,
  FirstPageRTL: LastPageIcon,
  PreviousPageRTL: KeyboardArrowRight,
  NextPageRTL: KeyboardArrowLeft,
  LastPageRTL: FirstPageIcon,
};

export default function TablePaginationActions({
  direction,
  page,
  lastPageIdx,
  onPageChange,
  keyboard,
  tableWidth,
  translator,
  isInSelectionMode,
}) {
  const onFirstPage = page === 0;
  const onLastPage = page >= lastPageIdx;
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const showFirstLast = tableWidth > 350;

  const handleSelectPage = (event) => onPageChange(+event.target.value);
  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, isInSelectionMode) : null;

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    const iconType = `${type}${direction === 'rtl' ? 'RTL' : ''}`;
    const IconComponent = icons[iconType];
    return (
      <IconButton
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => onPageChange(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={translator.get(`SNTable.Pagination.${type}`)}
        tabIndex={tabIndex}
        sx={disabledCondition ? { color: 'rgba(0, 0, 0, 0.3)', cursor: 'default' } : { color: 'rgba(0, 0, 0, 0.54)' }}
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </IconButton>
    );
  };

  return (
    <>
      {tableWidth > 650 && (
        <FormControl>
          <InputLabel htmlFor="pagination-dropdown" shrink={false}>
            {`${translator.get('SNTable.Pagination.SelectPage')}:`}
          </InputLabel>
          <Select
            native
            value={page}
            onChange={handleSelectPage}
            inputProps={{
              'data-testid': 'pagination-dropdown',
              tabIndex,
              id: 'pagination-dropdown',
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
      <>
        {showFirstLast && getButton(onFirstPage, 0, 'FirstPage')}
        {getButton(onFirstPage, page - 1, 'PreviousPage')}
        {getButton(onLastPage, page + 1, 'NextPage', !showFirstLast ? handleLastButtonTab : null)}
        {showFirstLast && getButton(onLastPage, lastPageIdx, 'LastPage', handleLastButtonTab)}
      </>
    </>
  );
}

TablePaginationActions.defaultProps = {
  direction: null,
};

TablePaginationActions.propTypes = {
  direction: PropTypes.string,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  lastPageIdx: PropTypes.number.isRequired,
  keyboard: PropTypes.object.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
