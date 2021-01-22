import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, createGenerateClassName, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import { sproutBase } from '@qlik/sprout-theme';
import TableWrapper from './table';
import { generateRandomString } from './utils';
import getCellRenderer from './cells/renderer';

export function render(element, props) {
  const { constraints, tableData } = props;

  sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
  sproutBase.overrides.MuiTableContainer.root.overflow = !constraints.active ? 'auto' : 'hidden';
  sproutBase.overrides.MuiPaper = { root: { height: '100%' } };
  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: generateRandomString(6),
  });

  const columnRenderers = tableData.columns.map(getCellRenderer);

  ReactDOM.render(
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <TableWrapper {...props} columnRenderers={columnRenderers} />
      </ThemeProvider>
    </StylesProvider>,
    element
  );
}

export function teardown(element) {
  ReactDOM.unmountComponentAtNode(element);
}
