import React from 'react';
import ReactDom from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';

import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';
import { RenderProps, RootProps } from '../types';

export function render(reactRoot: ReactDom.Root | HTMLElement, props: RenderProps) {
  const { direction, selectionsAPI } = props;
  const muiTheme = muiSetup(direction);
  const root = reactRoot as ReactDom.Root;
  const rootProps = props as RootProps;

  root.render(
    <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider selectionsAPI={selectionsAPI}>
          <TableWrapper {...rootProps} />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function teardown(reactRoot: ReactDom.Root) {
  reactRoot.unmount();
}

// eslint-disable-next-line no-unused-vars
export function mount(rootElement: HTMLElement) {
  /* noop in web */
}
