import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TablePagination from '@mui/material/TablePagination';
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

  if (!paginationNeeded) return null;

  const onFirstPage = page === 0;
  const onLastPage = page >= lastPageIdx;
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const tableWidth = footerContainer ? footerContainer.getBoundingClientRect().width : rect.width;
  const showFirstAndLast = tableWidth > 350;

  const handleChangeRowsPerPage = (evt) => {
    setPageInfo({ ...pageInfo, page: 0, rowsPerPage: +evt.target.value });
    announce({ keys: [['SNTable.Pagination.RowsPerPageChange', evt.target.value]], politeness: 'assertive' });
  };

  const handleSelectPage = (event) => handleChangePage(+event.target.value);

  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, selectionsAPI.isModal()) : null;

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    const iconType = `${type}${direction === 'rtl' ? 'RTL' : ''}`;
    const IconComponent = icons[iconType];
    return (
      <IconButton
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => handleChangePage(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={!constraints.passive && translator.get(`SNTable.Pagination.${type}`)}
        tabIndex={tabIndex}
        sx={
          disabledCondition
            ? {
                color: theme.table.pagination.disabledIconColor,
                cursor: 'default',
              }
            : { color: theme.table.pagination.iconColor }
        }
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </IconButton>
    );
  };

  const paperTablePaginationStyle = {
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

  const tablePaginationStyle = [
    constraints.active && { display: 'none' },
    {
      color: theme.table.pagination.color,
      '& .MuiNativeSelect-icon': {
        color: theme.table.pagination.iconColor,
      },
    },
  ];

  const selectProps = {
    inputProps: {
      'aria-label': translator.get('SNTable.Pagination.RowsPerPage'),
      'data-testid': 'select',
      tabIndex: !keyboard.enabled || keyboard.active ? 0 : -1,
    },
    native: true,
  };

  const inputProps = {
    'data-testid': 'pagination-dropdown',
    tabIndex,
    id: 'pagination-dropdown',
    style: { color: theme.table.pagination.color },
  };

  const selectStyle = {
    backgroundColor: 'inherit',
    '& .MuiNativeSelect-icon': { color: theme.table.pagination.iconColor },
  };

  const fixedRowsPerPage = selectionsAPI.isModal() || tableWidth < 550 || totalColumnCount > 100;

  const paginationContent = (
    <>
      <TablePagination
        sx={tablePaginationStyle}
        rowsPerPageOptions={fixedRowsPerPage ? [rowsPerPage] : rowsPerPageOptions}
        component="div"
        count={totalRowCount}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={`${translator.get('SNTable.Pagination.RowsPerPage')}:`}
        page={page}
        SelectProps={selectProps}
        labelDisplayedRows={({ from, to, count }) =>
          tableWidth > 250 && translator.get('SNTable.Pagination.DisplayedRowsLabel', [`${from} - ${to}`, count])
        }
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={() => <div>{null}</div>}
        onPageChange={() => {}}
      />
      {tableWidth > 650 && (
        <FormControl sx={{ color: theme.table.pagination.color }}>
          <InputLabel sx={{ color: theme.table.pagination.color }} htmlFor="pagination-dropdown" shrink={false}>
            {`${translator.get('SNTable.Pagination.SelectPage')}:`}
          </InputLabel>
          <Select sx={selectStyle} native value={page} onChange={handleSelectPage} inputProps={inputProps}>
            {Array(lastPageIdx + 1)
              .fill()
              .map((_, index) => (
                <option key={String(_)} value={index}>
                  {index + 1}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      <>
        {showFirstAndLast && getButton(onFirstPage, 0, 'FirstPage')}
        {getButton(onFirstPage, page - 1, 'PreviousPage')}
        {getButton(onLastPage, page + 1, 'NextPage', !showFirstAndLast ? handleLastButtonTab : null)}
        {showFirstAndLast && getButton(onLastPage, lastPageIdx, 'LastPage', handleLastButtonTab)}
      </>
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
