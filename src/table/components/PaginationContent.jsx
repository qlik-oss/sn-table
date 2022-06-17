import React, { memo } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { StyledSelect, StyledIconButton } from '../styles';
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

export const shouldShow = (component, width) => {
  switch (component) {
    case 'selectPage':
      return width > 700;
    case 'rppOptions':
      return width > 550;
    case 'firstLast':
      return width > 350;
    case 'displayedRows':
      return width > 250;
    default:
      return false;
  }
};

function PaginationContent({
  theme,
  direction,
  tableData,
  pageInfo,
  setPageInfo,
  keyboard,
  translator,
  constraints,
  footerContainer,
  isSelectionMode,
  rect,
  handleChangePage,
  announce,
}) {
  const { totalRowCount, totalColumnCount, totalPages, paginationNeeded } = tableData;
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;

  if (!paginationNeeded) return null;

  const paginationTheme = theme.table.pagination;
  const onFirstPage = page === 0;
  const onLastPage = page >= totalPages - 1;
  // The elements can be focused in sequential keyboard navigation:
  // - When nebula handles keyboard navigation
  // and focus is somewhere inside the extension, or
  // - When nebula does not handle keyboard navigation
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const width = footerContainer ? footerContainer.getBoundingClientRect().width : rect.width;
  const showFirstAndLast = shouldShow('firstLast', width);
  const showRowsPerPage = !isSelectionMode && shouldShow('rppOptions', width) && totalColumnCount <= 100;
  const displayedRowsText = translator.get('SNTable.Pagination.DisplayedRowsLabel', [
    `${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, totalRowCount)}`,
    totalRowCount,
  ]);

  const handleChangeRowsPerPage = (evt) => {
    setPageInfo({ ...pageInfo, page: 0, rowsPerPage: +evt.target.value });
    announce({ keys: [['SNTable.Pagination.RowsPerPageChange', evt.target.value]], politeness: 'assertive' });
  };

  const handleSelectPage = (event) => handleChangePage(+event.target.value);

  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, isSelectionMode) : null;

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    const iconType = `${type}${direction === 'rtl' ? 'RTL' : ''}`;
    const IconComponent = icons[iconType];

    return (
      <StyledIconButton
        disabledCondition={disabledCondition}
        paginationTheme={paginationTheme}
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => handleChangePage(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={!constraints.passive ? translator.get(`SNTable.Pagination.${type}`) : undefined}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </StyledIconButton>
    );
  };

  const getDropdown = (name, value, options, handleChange) => {
    const translationName = `SNTable.Pagination.${name}`;
    const id = `${name}-dropdown`;
    const inputProps = {
      tabIndex,
      id,
      'data-testid': id,
      style: { color: paginationTheme.color, height: 30 },
    };

    return (
      <FormControl sx={{ px: 2.5 }}>
        <InputLabel sx={{ color: paginationTheme.color }} htmlFor={id} shrink={false}>
          {`${translator.get(translationName)}:`}
        </InputLabel>
        <StyledSelect
          paginationTheme={paginationTheme}
          native
          value={value}
          onChange={handleChange}
          inputProps={inputProps}
        >
          {options}
        </StyledSelect>
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
      {[...Array(totalPages).keys()].map((pageIdx, index) => (
        <option key={pageIdx} value={index}>
          {pageIdx + 1}
        </option>
      ))}
    </>
  );

  return (
    <>
      {showRowsPerPage && getDropdown('RowsPerPage', rowsPerPage, rppOptions, handleChangeRowsPerPage)}
      {shouldShow('displayedRows', width) && <Box>{displayedRowsText}</Box>}
      {shouldShow('selectPage', width) && getDropdown('SelectPage', page, pageOptions, handleSelectPage)}
      {showFirstAndLast && getButton(onFirstPage, 0, 'FirstPage')}
      {getButton(onFirstPage, page - 1, 'PreviousPage')}
      {getButton(onLastPage, page + 1, 'NextPage', !showFirstAndLast ? handleLastButtonTab : null)}
      {showFirstAndLast && getButton(onLastPage, totalPages - 1, 'LastPage', handleLastButtonTab)}
    </>
  );
}

PaginationContent.defaultProps = {
  direction: null,
  footerContainer: null,
};

PaginationContent.propTypes = {
  theme: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  keyboard: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  isSelectionMode: PropTypes.bool.isRequired,
  rect: PropTypes.object.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  announce: PropTypes.func.isRequired,
  direction: PropTypes.string,
  footerContainer: PropTypes.object,
};

export default memo(PaginationContent);
