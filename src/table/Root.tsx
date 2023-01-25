import React from 'react';
import ReactDom from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import { stardust } from '@nebula.js/stardust';
import rtlPluginSc from 'stylis-plugin-rtl-sc';

import TableWrapper from './components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';
import { RenderProps, TableWrapperProps } from './types';
import VirualizedTable from './virtualized-table/Wrapper';
import { VirtualTableRenderProps } from './virtualized-table/types';

export function render(props: RenderProps, reactRoot?: ReactDom.Root) {
  const {
    direction,
    selectionsAPI,
    layout,
    translator,
    constraints,
    theme,
    keyboard,
    rootElement,
    embed,
    ...wrapperProps
  } = props;
  const muiTheme = muiSetup(direction);

  reactRoot?.render(
    <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider
          selectionsAPI={selectionsAPI}
          pageRows={props.tableData?.rows}
          layout={layout}
          translator={translator}
          constraints={constraints}
          theme={theme}
          keyboard={keyboard}
          rootElement={rootElement as HTMLElement}
          embed={embed as stardust.Embed}
        >
          <TableWrapper {...(wrapperProps as TableWrapperProps)} />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function renderVirtualizedTable(props: VirtualTableRenderProps, reactRoot?: ReactDom.Root) {
  const { selectionsAPI, layout, model, translator, constraints, theme, keyboard, rect, rootElement, embed } = props;
  const muiTheme = muiSetup('ltr');

  reactRoot?.render(
    // <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <TableContextProvider
        selectionsAPI={selectionsAPI}
        layout={layout}
        model={model}
        translator={translator}
        constraints={constraints}
        theme={theme}
        keyboard={keyboard}
        rootElement={rootElement}
        embed={embed}
      >
        <VirualizedTable rect={rect} />
      </TableContextProvider>
    </ThemeProvider>
    // {/* </React.StrictMode> */}
  );
}
export function teardown(reactRoot: ReactDom.Root) {
  reactRoot.unmount();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mount(rootElement: HTMLElement) {
  /* noop in web */
}
