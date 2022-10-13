import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { debouncer } from 'qlik-chart-modules';
import useInfiniteScrollData from '../../hooks/use-infinite-scroll-data';
import { VirtualizedTableProps } from '../../types';
import { Cell } from '../../../types';
import { getColumns } from '../../../handle-data';
import { StyledBodyRow, StyledHeadRow, StyledTableBody, StyledTableContainer, StyledTableWrapper } from '../../styles';
import getCellRenderer from '../../utils/get-cell-renderer';
import { getBodyCellStyle } from '../../utils/styling-utils';

const ROW_HEIGHT = 32;

const OldLikeTable = (props: VirtualizedTableProps) => {
  const { rect, layout, model, theme } = props;
  const containerRef = useRef() as React.RefObject<HTMLDivElement>;
  const { data: rows, loadData, loadRow } = useInfiniteScrollData(model, layout);
  const { columns } = useMemo(() => getColumns(layout), [layout]);
  const rowCount = useMemo(() => Math.round(rect.height / ROW_HEIGHT), [rect.height]);
  const startRowIndex = useRef(0);
  const CellRenderer = getCellRenderer(false, false);
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
  const cellStyle = { color: bodyCellStyle.color as string, backgroundColor: theme.table.backgroundColor as string };

  useEffect(() => console.log('rows', rows), [rows]);

  // useEffect(() => console.log('columns', columns), [columns]);

  console.log('startRowIndex', startRowIndex.current);

  // const scrollTo = useCallback(
  //   (e: WheelEvent) => {
  //     const scrollDistance = e.wheelDeltaY > 0 ? -53 : 53;
  //     containerRef.current?.scrollTo({
  //       top: containerRef.current?.scrollTop + scrollDistance,
  //       left: 0,
  //       // behavior: 'instant',
  //     });
  //   },
  //   [containerRef]
  // );

  const wheelHandler = useCallback(
    (e: WheelEvent) => {
      const scrolledRowCount = Math.abs(e.wheelDeltaY) / ROW_HEIGHT;
      const scrollDirection = Math.sign(e.wheelDeltaY);
      startRowIndex.current -= Math.ceil(scrolledRowCount) * scrollDirection;
      startRowIndex.current = Math.max(startRowIndex.current, 0);

      // Not sure why but wheelDeltaY is sometimes 0
      if (scrolledRowCount === 0) {
        return;
      }

      loadRow(startRowIndex.current, rowCount);
    },
    [loadRow, rowCount]
  );

  const debouncedScrollTo = useMemo(() => debouncer(wheelHandler, 20), [wheelHandler]);

  useEffect(() => {
    if (!layout) return;

    loadData(0, 0, 50, rowCount);
  }, [layout, rowCount, loadData]);

  useEffect(() => {
    const onWheel = (e: Event) => {
      e.preventDefault();
      debouncedScrollTo(e);
    };
    containerRef.current?.addEventListener('wheel', onWheel);
    const ref = containerRef.current;

    return () => {
      ref?.removeEventListener('wheel', onWheel);
    };
  }, [containerRef, debouncedScrollTo]);

  if (!rows) {
    return null;
  }

  return (
    <StyledTableWrapper tableTheme={theme.table} ref={containerRef}>
      <StyledTableContainer fullHeight constraints={{ active: true }}>
        <Table stickyHeader>
          <TableHead>
            <StyledHeadRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  {col.label}
                </TableCell>
              ))}
            </StyledHeadRow>
          </TableHead>
          <StyledTableBody bodyCellStyle={bodyCellStyle}>
            {rows.slice(startRowIndex.current, startRowIndex.current + rowCount).map((row) => (
              <StyledBodyRow key={row.key as string} className="sn-table-row" bodyCellStyle={bodyCellStyle}>
                {Object.values(row)
                  .filter((cell) => typeof cell !== 'string')
                  .map((cell) => (
                    <CellRenderer
                      key={`${(cell as Cell).colIdx}-${(cell as Cell).qElemNumber}`}
                      align="right"
                      styling={cellStyle}
                      cell={cell as Cell}
                      column={columns[(cell as Cell).colIdx]}
                    >
                      {(cell as Cell).qText}
                    </CellRenderer>
                  ))}
              </StyledBodyRow>
            ))}
          </StyledTableBody>
        </Table>
      </StyledTableContainer>
    </StyledTableWrapper>
  );
};

export default OldLikeTable;
