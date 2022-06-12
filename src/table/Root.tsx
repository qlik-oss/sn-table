import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import { Root } from 'react-dom/client';

import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import { RootProps } from '../types';

export function render(reactRoot: Root, props: RootProps): void {
  const { muiTheme, direction, selectionsAPI } = props;

  reactRoot?.render(
    <React.StrictMode>
      <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : []}>
        <ThemeProvider theme={muiTheme}>
          <TableContextProvider selectionsAPI={selectionsAPI}>
            <TableWrapper {...props} />
          </TableContextProvider>
        </ThemeProvider>
      </StyleSheetManager>
    </React.StrictMode>
  );
}

export function teardown(reactRoot: Root) {
  reactRoot.unmount();
}

export function mount() {
  /* noop in web */
}
