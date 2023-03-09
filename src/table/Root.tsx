import React from 'react';
import ReactDom from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import { stardust } from '@nebula.js/stardust';
import rtlPluginSc from 'stylis-plugin-rtl-sc';

import TableWrapper from './pagination-table/components/TableWrapper';
import { TableContextProvider } from './context';
import muiSetup from './mui-setup';
import { RenderProps, TableWrapperProps } from './types';
import VirtualizedTable from './virtualized-table/Wrapper';
import { VirtualTableRenderProps } from './virtualized-table/types';
import { Announce, ApplyColumnWidths } from '../types';

export function renderPaginationTable(props: RenderProps, reactRoot?: ReactDom.Root) {
  const muiTheme = muiSetup(props.direction);

  reactRoot?.render(
    <StyleSheetManager stylisPlugins={props.direction === 'rtl' ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider
          {...props}
          model={props.model as EngineAPI.IGenericObject}
          rootElement={props.rootElement as HTMLElement}
          embed={props.embed as stardust.Embed}
          applyColumnWidths={props.applyColumnWidths as ApplyColumnWidths}
          tableWidth={props.rect.width}
          announce={props.announce as Announce}
          areBasicFeaturesEnabled={props.areBasicFeaturesEnabled as boolean}
        >
          <TableWrapper />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function renderVirtualizedTable(props: VirtualTableRenderProps, reactRoot?: ReactDom.Root) {
  const {
    app,
    selectionsAPI,
    layout,
    model,
    translator,
    constraints,
    theme,
    keyboard,
    rect,
    rootElement,
    embed,
    changeSortOrder,
    tableData,
    applyColumnWidths,
    setPage,
    pageInfo,
    initialDataPages,
  } = props;
  const muiTheme = muiSetup('ltr');

  reactRoot?.render(
    <React.StrictMode>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider
          app={app}
          selectionsAPI={selectionsAPI}
          layout={layout}
          model={model}
          translator={translator}
          constraints={constraints}
          theme={theme}
          keyboard={keyboard}
          rootElement={rootElement}
          embed={embed}
          changeSortOrder={changeSortOrder}
          tableData={tableData}
          applyColumnWidths={applyColumnWidths}
          tableWidth={rect.width}
          setPage={setPage}
          pageInfo={pageInfo}
          initialDataPages={initialDataPages}
        >
          <VirtualizedTable rect={rect} />
        </TableContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
export function teardown(reactRoot: ReactDom.Root) {
  reactRoot.unmount();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mount(rootElement: HTMLElement) {
  /* noop in web */
}
