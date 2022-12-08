import React from 'react';
import ReactDom from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';

import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';
import { RenderProps, TableWrapperProps } from './types';
import VirualizedTable from './components/virtualized-table/Wrapper';
import { WrapperProps } from './components/virtualized-table/types';

export function render(props: RenderProps, reactRoot?: ReactDom.Root) {
  const { direction, selectionsAPI, tableData } = props;
  const muiTheme = muiSetup(direction);

  reactRoot?.render(
    <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider selectionsAPI={selectionsAPI} pageRows={tableData?.rows}>
          <TableWrapper {...(props as TableWrapperProps)} />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function renderVirtualizedTable(props: WrapperProps, reactRoot?: ReactDom.Root) {
  const { selectionsAPI } = props;
  const muiTheme = muiSetup('ltr');

  reactRoot?.render(
    // <React.StrictMode> TODO disable for now as it makes double seletions
    <ThemeProvider theme={muiTheme}>
      <TableContextProvider selectionsAPI={selectionsAPI} pageRows={[]}>
        <VirualizedTable {...props} />
      </TableContextProvider>
    </ThemeProvider>
    // </React.StrictMode>
  );
}
export function teardown(reactRoot: ReactDom.Root) {
  reactRoot.unmount();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mount(rootElement: HTMLElement) {
  /* noop in web */
}
