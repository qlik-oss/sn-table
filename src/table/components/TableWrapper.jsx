import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import TablePaginationActions from './TablePaginationActions';
import useDidUpdateEffect from './useDidUpdateEffect';
import { handleTableWrapperKeyDown } from '../utils/handle-key-press';
import { updateFocus, handleResetFocus, handleFocusoutEvent } from '../utils/handle-accessibility';
import { handleScroll, handleNavigateTop } from '../utils/handle-scroll';
import announcementFactory from '../utils/announcement-factory';

const useStyles = makeStyles({
  paper: {
    height: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  containerOverflowAuto: {
    height: 'calc(100% - 52px)',
    overflow: 'auto',
  },
  containerOverflowHidden: {
    height: '100%',
    overflow: 'hidden',
  },
  tablePaginationSection: {
    backgroundColor: 'rgb(255, 255, 255)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  paginationHidden: {
    display: 'none',
  },
  screenReaderOnly: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});

export default function TableWrapper(props) {
  const { rootElement, tableData, pageInfo, setPageInfo, constraints, translator, selectionsAPI, keyboard, rect } =
    props;
  const { size, rows, columns } = tableData;
  const { page, rowsPerPage } = pageInfo;
  const [focusedCellCoord, setFocusedCellCoord] = useState([0, 0]);
  const shouldRefocus = useRef(false);
  const tableSectionRef = useRef();
  const tableWrapperRef = useRef();
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || rect.width < 550;
  const announce = useMemo(() => announcementFactory(rootElement, translator), [translator.language]);

  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };

  const handleChangePage = (evt, newPage) => setPageInfo({ ...pageInfo, page: newPage });
  const handleChangeRowsPerPage = (evt) => setPageInfo({ page: 0, rowsPerPage: +evt.target.value });

  useEffect(() => {
    const scrollCallback = (evt) => handleScroll(evt, tableSectionRef);
    const focusOutCallback = (evt) => handleFocusoutEvent(evt, shouldRefocus, keyboard);

    tableSectionRef.current && tableSectionRef.current.addEventListener('wheel', scrollCallback);
    tableWrapperRef.current && tableWrapperRef.current.addEventListener('focusout', focusOutCallback);
    return () => {
      tableSectionRef.current.removeEventListener('wheel', scrollCallback);
      tableWrapperRef.current.removeEventListener('focusout', focusOutCallback);
    };
  }, []);

  useEffect(
    () => handleNavigateTop({ tableSectionRef, focusedCellCoord, rootElement }),
    [tableSectionRef, focusedCellCoord]
  );

  useDidUpdateEffect(() => {
    if (!keyboard.enabled) return;

    updateFocus({
      focusType: keyboard.active ? 'focus' : 'blur',
      rowElements: rootElement.getElementsByClassName('sn-table-row'),
      cellCoord: focusedCellCoord,
    });
  }, [keyboard.active]);

  // Except for first render, whenever the size of the data (number of rows per page, rows, columns) or page changes,
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus({
      focusedCellCoord,
      rootElement,
      shouldRefocus,
      setFocusedCellCoord,
      hasSelections: selectionsAPI.isModal(),
      shouldAddTabstop: !keyboard.enabled || keyboard.active,
    });
  }, [rows.length, size.qcy, size.qcx, page]);

  return (
    <Paper
      className={classes.paper}
      ref={tableWrapperRef}
      onKeyDown={(evt) =>
        handleTableWrapperKeyDown({
          evt,
          totalRowSize: size.qcy,
          page,
          rowsPerPage,
          handleChangePage,
          setShouldRefocus,
          keyboard,
          isSelectionActive: selectionsAPI.isModal(),
        })
      }
    >
      <div id="sn-table-announcer" aria-live="polite" aria-atomic="true" className={classes.screenReaderOnly} />
      <TableContainer
        ref={tableSectionRef}
        className={classes[containerMode]}
        tabIndex={-1}
        role="application"
        data-testid="table-wrapper"
      >
        <Table
          stickyHeader
          aria-label={translator.get('SNTable.Accessibility.RowsAndColumns', [
            `${rows.length + 1}`,
            `${columns.length}`,
          ])}
        >
          <TableHeadWrapper {...props} setFocusedCellCoord={setFocusedCellCoord} focusedCellCoord={focusedCellCoord} />
          <TableBodyWrapper
            {...props}
            announce={announce}
            focusedCellCoord={focusedCellCoord}
            setFocusedCellCoord={setFocusedCellCoord}
            setShouldRefocus={setShouldRefocus}
            tableWrapperRef={tableWrapperRef}
          />
        </Table>
      </TableContainer>
      <Paper className={classes.tablePaginationSection}>
        <TablePagination
          className={classes[paginationHidden]}
          rowsPerPageOptions={paginationFixedRpp ? [rowsPerPage] : [10, 25, 100]}
          component="div"
          count={size.qcy}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={translator.get('SNTable.Pagination.RowsPerPage')}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': translator.get('SNTable.Pagination.RowsPerPage'),
              'data-testid': 'select',
              style: {
                color: '#404040',
              },
              tabIndex: !keyboard.enabled || keyboard.active ? 0 : -1,
            },
            native: true,
          }}
          labelDisplayedRows={({ from, to, count }) =>
            rect.width > 250 && translator.get('SNTable.Pagination.DisplayedRowsLabel', [`${from} - ${to}`, count])
          }
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={() => <div>{null}</div>}
        />
        <TablePaginationActions
          page={page}
          onPageChange={handleChangePage}
          lastPage={Math.ceil(size.qcy / rowsPerPage) - 1}
          keyboard={keyboard}
          isInSelectionMode={selectionsAPI.isModal()}
          tableWidth={rect.width}
          translator={translator}
        />
      </Paper>
    </Paper>
  );
}

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  pageInfo: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  rect: PropTypes.object.isRequired,
};
