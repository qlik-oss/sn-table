import { createRoot } from 'react-dom/client';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';
import { SelectionContextProvider } from './utils/selections-utils';

let reactRoot;

export function render(rootElement, props) {
  const { muiTheme, direction } = props;
  if (!reactRoot) {
    reactRoot = createRoot(rootElement);
  }

  reactRoot.render(
    <React.StrictMode>
      <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : []}>
        <ThemeProvider theme={muiTheme}>
          <SelectionContextProvider selectionsAPI={props.selectionsAPI}>
            <TableWrapper {...props} />
          </SelectionContextProvider>
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
