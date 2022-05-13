import React from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';

let root;

export function render(rootElement, props) {
  const { muiTheme, direction } = props;
  if (!root) root = createRoot(rootElement);

  root.render(
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
  root.unmountComponentAtNode();
}

export function mount() {
  /* noop in web */
}
