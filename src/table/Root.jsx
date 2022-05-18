import { createRoot } from 'react-dom/client';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';

let reactRoot;

export function render(rootElement, props) {
  const { muiTheme, direction, selectionsAPI } = props;
  if (!reactRoot) {
    reactRoot = createRoot(rootElement);
  }

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

export function teardown() {
  reactRoot.unmount();
}

export function mount() {
  /* noop in web */
}
