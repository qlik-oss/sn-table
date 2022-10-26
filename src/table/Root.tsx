import React from 'react';
import ReactDom from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';

import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';
import { RenderProps, TableWrapperProps } from './types';
import { TableData } from '../types';

export function render(props: RenderProps, reactRoot?: ReactDom.Root) {
  const { direction, selectionsAPI, tableData, rect } = props;
  const muiTheme = muiSetup(direction);

  reactRoot?.render(
    <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider selectionsAPI={selectionsAPI} tableData={tableData as TableData} tableWidth={rect.width}>
          <TableWrapper {...(props as TableWrapperProps)} />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function teardown(reactRoot: ReactDom.Root) {
  reactRoot.unmount();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mount(rootElement: HTMLElement) {
  /* noop in web */
}
