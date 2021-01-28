import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import TableWrapper from './table';
import getCellRenderer from './cells/renderer';

export function render(element, props) {
  const { muiParameters, tableData, selections } = props;

  const columnRenderers = tableData.columns.map((c) => getCellRenderer(c, selections.isEnabled));

  ReactDOM.render(
    <StylesProvider generateClassName={muiParameters.generateClassName}>
      <ThemeProvider theme={muiParameters.theme}>
        <TableWrapper {...props} columnRenderers={columnRenderers} />
      </ThemeProvider>
    </StylesProvider>,
    element
  );
}

export function teardown(element) {
  ReactDOM.unmountComponentAtNode(element);
}
