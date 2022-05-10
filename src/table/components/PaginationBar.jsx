import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
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

const shouldShow = (component, width) => {
  switch (component) {
    case 'selectPage':
      return width > 650;
    case 'rppOptions':
      return width > 550;
    case 'firstLast':
      return width > 350;
    case 'currentRows':
      return width > 250;
    default:
      return false;
  }
};

const Portal = ({ children, target }) => ReactDOM.createPortal(children, target);
export default function PaginationBar({
  theme,
  direction,
  tableData,
  pageInfo,
  setPageInfo,
  keyboard,
  translator,
  constraints,
  footerContainer,
  selectionsAPI,
  rect,
  handleChangePage,
  lastPageIdx,
  announce,
}) {
  const { totalRowCount, totalColumnCount, paginationNeeded } = tableData;
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;

  if (!paginationNeeded || constraints.active) return null;

  const onFirstPage = page === 0;
  const onLastPage = page >= lastPageIdx;
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const width = footerContainer ? footerContainer.getBoundingClientRect().width : rect.width;
  const showFirstAndLast = shouldShow('firstLast', width);
  const showRppOptions = !selectionsAPI.isModal() && shouldShow('rppOptions', width) && totalColumnCount <= 100;

  const handleChangeRowsPerPage = (evt) => {
    setPageInfo({ ...pageInfo, page: 0, rowsPerPage: +evt.target.value });
    announce({ keys: [['SNTable.Pagination.RowsPerPageChange', evt.target.value]], politeness: 'assertive' });
  };

  const handleSelectPage = (event) => handleChangePage(+event.target.value);

  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, selectionsAPI.isModal()) : null;

  const paperTablePaginationStyle = {
    height: '40px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 1,
    backgroundColor: theme.table.backgroundColor,
    boxShadow: 'none',
    borderStyle: 'solid',
    borderWidth: '0px 0px 1px 0px',
    borderRadius: 0,
    borderColor: theme.table.pagination.borderColor,
  };

  const selectStyle = {
    backgroundColor: 'inherit',
    '& .MuiNativeSelect-icon': { color: theme.table.pagination.iconColor },
  };

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    const iconType = `${type}${direction === 'rtl' ? 'RTL' : ''}`;
    const IconComponent = icons[iconType];
    const buttonStyle = disabledCondition
      ? {
          color: theme.table.pagination.disabledIconColor,
          cursor: 'default',
        }
      : { color: theme.table.pagination.iconColor };

    return (
      <IconButton
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => handleChangePage(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={!constraints.passive && translator.get(`SNTable.Pagination.${type}`)}
        tabIndex={tabIndex}
        sx={buttonStyle}
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </IconButton>
    );
  };

  const getDropdown = (name, value, options, handleChange) => {
    const translationName = `SNTable.Pagination.${name}`;
    const id = `${name}-dropdown`;
    const inputProps = {
      tabIndex,
      id,
      'data-testid': id,
      style: { color: theme.table.pagination.color },
    };

    return (
      <FormControl sx={{ color: theme.table.pagination.color }}>
        <InputLabel sx={{ color: theme.table.pagination.color }} htmlFor="rpp-dropdown" shrink={false}>
          {`${translator.get(translationName)}:`}
        </InputLabel>
        <Select sx={selectStyle} native value={value} onChange={handleChange} inputProps={inputProps}>
          {options}
        </Select>
      </FormControl>
    );
  };

  const rppOptions = (
    <>
      {rowsPerPageOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </>
  );

  const pageOptions = (
    <>
      {[...Array(lastPageIdx + 1).keys()].map((pageIdx, index) => (
        <option key={pageIdx} value={index}>
          {pageIdx + 1}
        </option>
      ))}
    </>
  );

  // TODO: proper mui component
  const currentRows = shouldShow('currentRows', width) && (
    <div>
      {translator.get('SNTable.Pagination.DisplayedRowsLabel', [
        `${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, totalRowCount)}`,
        totalRowCount,
      ])}
    </div>
  );

  const paginationContent = (
    <>
      {showRppOptions && getDropdown('RowsPerPage', rowsPerPage, rppOptions, handleChangeRowsPerPage)}
      {currentRows}
      {shouldShow('selectPage', width) && getDropdown('SelectPage', page, pageOptions, handleSelectPage)}
      {showFirstAndLast && getButton(onFirstPage, 0, 'FirstPage')}
      {getButton(onFirstPage, page - 1, 'PreviousPage')}
      {getButton(onLastPage, page + 1, 'NextPage', !showFirstAndLast ? handleLastButtonTab : null)}
      {showFirstAndLast && getButton(onLastPage, lastPageIdx, 'LastPage', handleLastButtonTab)}
    </>
  );

  return footerContainer ? (
    <Portal target={footerContainer}>{paginationContent}</Portal>
  ) : (
    <Paper sx={paperTablePaginationStyle}>{paginationContent}</Paper>
  );
}

PaginationBar.defaultProps = {
  direction: null,
  footerContainer: null,
};

PaginationBar.propTypes = {
  theme: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  keyboard: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  direction: PropTypes.string,
  footerContainer: PropTypes.object,
  rect: PropTypes.object.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  lastPageIdx: PropTypes.number.isRequired,
  announce: PropTypes.func.isRequired,
};
