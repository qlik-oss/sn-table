import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDom from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import rtlPluginSc from "stylis-plugin-rtl-sc";

import { TableContextProvider } from "./context";
import muiSetup from "./mui-setup";
import TableWrapper from "./pagination-table/components/TableWrapper";
import { RenderProps } from "./types";
import VirtualizedTable from "./virtualized-table/Wrapper";
import { VirtualTableRenderProps } from "./virtualized-table/types";

export function renderPaginationTable(props: RenderProps, reactRoot: ReactDom.Root) {
  const {
    app,
    model,
    direction,
    selectionsAPI,
    layout,
    translator,
    interactions,
    theme,
    keyboard,
    rootElement,
    embed,
    changeSortOrder,
    applyColumnWidths,
    tableData,
    rect,
    viewService,
    ...wrapperProps
  } = props;
  const muiTheme = muiSetup(direction);

  reactRoot?.render(
    <StyleSheetManager stylisPlugins={direction === "rtl" ? [rtlPluginSc] : undefined}>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider
          app={app}
          model={model}
          tableData={tableData}
          selectionsAPI={selectionsAPI}
          layout={layout}
          translator={translator}
          interactions={interactions}
          theme={theme}
          keyboard={keyboard}
          rootElement={rootElement}
          embed={embed}
          changeSortOrder={changeSortOrder}
          applyColumnWidths={applyColumnWidths}
          rect={rect}
          viewService={viewService}
          isNewHeadCellMenuEnabled={wrapperProps.isNewHeadCellMenuEnabled}
        >
          <TableWrapper {...wrapperProps} direction={direction} />
        </TableContextProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export function renderVirtualizedTable(props: VirtualTableRenderProps, reactRoot: ReactDom.Root) {
  const {
    app,
    selectionsAPI,
    layout,
    model,
    translator,
    interactions,
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
    viewService,
    isNewHeadCellMenuEnabled,
  } = props;
  const muiTheme = muiSetup("ltr");

  reactRoot.render(
    <React.StrictMode>
      <ThemeProvider theme={muiTheme}>
        <TableContextProvider
          app={app}
          selectionsAPI={selectionsAPI}
          layout={layout}
          model={model}
          translator={translator}
          interactions={interactions}
          theme={theme}
          keyboard={keyboard}
          rootElement={rootElement}
          embed={embed}
          changeSortOrder={changeSortOrder}
          tableData={tableData}
          applyColumnWidths={applyColumnWidths}
          rect={rect}
          setPage={setPage}
          pageInfo={pageInfo}
          initialDataPages={initialDataPages}
          viewService={viewService}
          isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
        >
          <VirtualizedTable />
        </TableContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
