import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';

let root;

export function render(props) {
  const { reactRoot, muiTheme, direction } = props;
  root = reactRoot;

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
  root.unmount();
}

export function mount() {
  /* noop in web */
}
