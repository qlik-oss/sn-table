// import React from 'react';
// import { render } from '@testing-library/react';
// import TableCell, { TableCellProps } from '@mui/material/TableCell';

// import * as withStyling from '../withStyling';
// import { AnnounceFn, Cell, CellStyle, Column, hocProps } from '../../../types';

// describe('withStyling', () => {
//   let HOC: (props: TableCellProps) => JSX.Element;
//   let styling: CellStyle;
//   // let announce: AnnounceFn;
//   // let cell: Cell;
//   // let column: Column;

//   beforeEach(() => {
//     HOC = withStyling.default((props: TableCellProps) => <TableCell {...props}>{props.children}</TableCell>);

//     styling = {} as unknown as CellStyle;
//   });

//   it('should render table cell', () => {
//     const { queryByText } = render(<HOC styling={styling}>someValue</HOC>);

//     expect(queryByText('someValue')).toBeVisible();
//   });
// });
