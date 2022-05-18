import { createRoot } from 'react-dom/client';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';

let reactRoot;

export function render(props) {
  const { muiTheme, direction, rootElement, id } = props;

  // eslint-disable-next-line no-underscore-dangle
  if (reactRoot?._internalRoot?.identifierPrefix !== id) {
    reactRoot = createRoot(rootElement, { identifierPrefix: id });
  }

  reactRoot.render(
    <React.StrictMode>
      <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : []}>
        <ThemeProvider theme={muiTheme}>
          <TableWrapper {...props} />
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
