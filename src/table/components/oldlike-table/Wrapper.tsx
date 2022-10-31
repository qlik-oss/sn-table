// import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
// import Table from '@mui/material/Table';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import { debouncer } from 'qlik-chart-modules';
// import useInfiniteScrollData from '../../hooks/use-infinite-scroll-data';
// import { VirtualizedTableProps } from '../../types';
// import { Cell } from '../../../types';
// import { getColumns } from '../../../handle-data';
// import { StyledBodyRow, StyledHeadRow, StyledTableBody, StyledTableContainer, StyledTableWrapper } from '../../styles';
// import getCellRenderer from '../../utils/get-cell-renderer';
// import { getBodyCellStyle } from '../../utils/styling-utils';
// import useColumnSize from '../../hooks/use-column-size';
// import FullSizeContainer from '../virtualized-table/FullSizeContainer';

// const ROW_HEIGHT = 32;

// const getColumnCount = (width: number, columnWidth: number[], currentStartIndex: number) => {
//   let columnCount = 0;
//   let summedWidth = 0;
//   for (let index = currentStartIndex; index < columnWidth.length; index++) {
//     if (summedWidth < width) {
//       columnCount += 1;
//       summedWidth += columnWidth[index] + 14 * 2;
//     } else {
//       return columnCount;
//     }
//   }

//   return columnCount;
// };

// const findColumnByPixel = (columnWidth: number[], pixel: number) => {
//   let startX = 0;
//   for (let index = 0; index < columnWidth.length; index++) {
//     if (pixel >= startX) {
//       const endX = startX + columnWidth[index];

//       if (pixel <= endX) {
//         return index;
//       }
//     }

//     startX += columnWidth[index];
//   }

//   return columnWidth.length - 1;
// };

// const OldLikeTable = (props: VirtualizedTableProps) => {
//   const { rect, layout, model, theme } = props;
//   const containerRef = useRef() as React.RefObject<HTMLDivElement>;
//   const { data: rows, loadData, top } = useInfiniteScrollData(model, layout);
//   const { columns } = useMemo(() => getColumns(layout), [layout]);
//   const rowCount = useMemo(() => Math.round(rect.height / ROW_HEIGHT), [rect.height]);
//   const startRowIndex = useRef(0);
//   const startColumnIndex = useRef(0);
//   const CellRenderer = getCellRenderer(false, false);
//   const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
//   const cellStyle = { color: bodyCellStyle.color as string, backgroundColor: theme.table.backgroundColor as string };
//   const fullSizeRef = useRef() as React.RefObject<HTMLDivElement>;
//   const columnSize = useColumnSize(rect, columns);
//   const columnCount = useRef(getColumnCount(rect.width, columnSize.width, startColumnIndex.current));
//   const scrollX = useRef(0);
//   const scrollY = useRef(0);
//   const totalColumnWidth = useMemo(() => columnSize.width.reduce((sum, width) => sum + width, 0), [columnSize]);
//   const maxTotalRowHeight = (layout.qHyperCube.qSize.qcy - rowCount) * ROW_HEIGHT;

//   // console.log('columnSize', columnSize, columnCount.current);
//   // console.log('rect', rect);

//   useEffect(() => console.log('rows', rows), [rows]);
//   // console.log('render', [...rows], [...columns]);

//   // useEffect(() => console.log('columns', [...columns]), [columns]);

//   const wheelHandlerY = useCallback(
//     (e: WheelEvent) => {
//       scrollY.current = Math.min(Math.max(0, scrollY.current + e.deltaY), maxTotalRowHeight);
//       const rowIndex = Math.round(scrollY.current / ROW_HEIGHT);

//       if (rowIndex === startRowIndex.current) {
//         return;
//       }

//       startRowIndex.current = rowIndex;

//       loadData(startColumnIndex.current, startRowIndex.current, columnCount.current, rowCount);
//     },
//     [loadData, rowCount, columnCount, scrollY, maxTotalRowHeight]
//   );

//   const wheelHandlerX = useCallback(
//     (e: WheelEvent) => {
//       scrollX.current = Math.min(Math.max(0, scrollX.current + e.deltaX), totalColumnWidth);
//       const colIndex = findColumnByPixel(columnSize.width, scrollX.current);
//       const newStartColumnIndex = Math.min(colIndex, columns.length - columnCount.current);

//       if (newStartColumnIndex === startColumnIndex.current) {
//         return;
//       }

//       startColumnIndex.current = newStartColumnIndex;

//       columnCount.current = getColumnCount(rect.width, columnSize.width, startColumnIndex.current);

//       loadData(startColumnIndex.current, startRowIndex.current, columnCount.current, rowCount);
//     },
//     [
//       startColumnIndex,
//       startRowIndex,
//       columns,
//       loadData,
//       columnCount,
//       rect.width,
//       columnSize.width,
//       scrollX,
//       totalColumnWidth,
//       rowCount,
//     ]
//   );

//   const scrollHandlerX = useCallback(
//     (e) => {
//       scrollY.current = e.target.scrollTop;
//       const rowIndex = Math.round(scrollY.current / ROW_HEIGHT);
//       console.log('rowIndex', rowIndex);

//       if (rowIndex === startRowIndex.current) {
//         return;
//       }

//       startRowIndex.current = rowIndex;

//       loadData(startColumnIndex.current, startRowIndex.current, columnCount.current, rowCount);
//     },
//     [loadData, rowCount]
//   );

//   const debouncedWheelHandlerY = useMemo(() => debouncer(wheelHandlerY, 0), [wheelHandlerY]);
//   const debouncedWheelHandlerX = useMemo(() => debouncer(wheelHandlerX, 0), [wheelHandlerX]);

//   useEffect(() => {
//     console.log('init data load', layout);
//     if (!layout) return;

//     loadData(0, 0, 50, rowCount);
//   }, [layout, rowCount, loadData]);

//   // useLayoutEffect(() => {
//   //   if (containerRef.current) {
//   //     containerRef.current.attachShadow({ mode: 'open' });
//   //     const elm = document.createElement('div');
//   //     elm.innerText = 'Testing';
//   //     containerRef.current.shadowRoot?.appendChild(elm);
//   //   }
//   // }, [containerRef]);

//   useEffect(() => {
//     const ref = containerRef.current;
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
//         debouncedWheelHandlerX(e);
//       } else {
//         debouncedWheelHandlerY(e);
//       }
//     };

//     const onScroll = (e) => {
//       e.preventDefault();
//       scrollHandlerX(e);
//     };
//     containerRef.current?.addEventListener('wheel', onWheel);
//     containerRef.current?.addEventListener('scroll', onScroll);

//     return () => {
//       ref?.removeEventListener('wheel', onWheel);
//       ref?.removeEventListener('scroll', onScroll);
//     };
//   }, [containerRef, debouncedWheelHandlerY, debouncedWheelHandlerX, scrollHandlerX]);

//   if (!rows) {
//     console.log('NO ROWS');
//     return null;
//   }

//   return (
//     <StyledTableWrapper
//       tableTheme={theme.table}
//       ref={containerRef}
//       data-key="StyledTableWrapper"
//       sx={{ overflow: 'scroll', width: '100%', height: '100%', position: 'relative' }}
//     >
//       <FullSizeContainer
//         height={Math.min(Math.max(rect.height, layout.qHyperCube.qSize.qcy * ROW_HEIGHT), 17000000)}
//         width={totalColumnWidth}
//         forwardRef={fullSizeRef}
//       />
//       <StyledTableContainer
//         fullHeight
//         constraints={{ active: true }}
//         data-key="StyledTableContainer"
//         sx={{ position: 'sticky', left: 0, top: 0 }}
//       >
//         <Table stickyHeader sx={{ tableLayout: 'fixed' }} data-key="Table">
//           <TableHead>
//             <StyledHeadRow>
//               {columns.map((col, index) => {
//                 if (index < startColumnIndex.current || index >= startColumnIndex.current + columnCount.current) {
//                   return null;
//                 }
//                 return (
//                   <TableCell key={col.id} align={col.align} sx={{ width: `${columnSize.width[index]}px` }}>
//                     {col.label}
//                   </TableCell>
//                 );
//               })}
//             </StyledHeadRow>
//           </TableHead>
//           <StyledTableBody bodyCellStyle={bodyCellStyle}>
//             {rows.slice(top, top + rowCount).map((row) => (
//               <StyledBodyRow key={row.key as string} className="sn-table-row" bodyCellStyle={bodyCellStyle}>
//                 {Object.values(row)
//                   .filter(
//                     (cell) =>
//                       typeof cell !== 'string' &&
//                       cell.colIdx >= startColumnIndex.current &&
//                       cell.colIdx < startColumnIndex.current + columnCount.current
//                   )
//                   .map((cell) => (
//                     <CellRenderer
//                       key={`${(cell as Cell).colIdx}-${(cell as Cell).qElemNumber}`}
//                       align="right"
//                       styling={cellStyle}
//                       cell={cell as Cell}
//                       column={columns[(cell as Cell).colIdx]}
//                     >
//                       {(cell as Cell).qText}
//                     </CellRenderer>
//                   ))}
//               </StyledBodyRow>
//             ))}
//           </StyledTableBody>
//         </Table>
//       </StyledTableContainer>
//       {/* </FullSizeContainer> */}
//     </StyledTableWrapper>
//   );
// };

// export default OldLikeTable;
