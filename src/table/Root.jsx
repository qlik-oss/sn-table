import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';

export function render(reactRoot, props) {
  const { direction, selectionsAPI } = props;
  const muiTheme = muiSetup(direction);

  reactRoot.render(
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

export function teardown(reactRoot) {
  reactRoot.unmount();
}

// eslint-disable-next-line no-unused-vars
export function mount(rootElement) {
  /* noop in web */
}
