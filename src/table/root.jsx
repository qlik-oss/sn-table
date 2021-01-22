import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';
import { sproutBase } from '@qlik/sprout-theme';
import TableWrapper from './table';
import { generateRandomString } from './utils';
import getCellRenderer from './cells/renderer';

export function render(element, props) {
  const { constraints, tableData, selections } = props;

  sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
  sproutBase.overrides.MuiTableContainer.root.overflow = !constraints.active ? 'auto' : 'hidden';
  sproutBase.overrides.MuiPaper = { root: { height: '100%' } };
  const theme = createMuiTheme(sproutBase);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: generateRandomString(6),
  });

  const columnRenderers = tableData.columns.map((c) => getCellRenderer(c, selections.isEnabled));

  ReactDOM.render(
    <ThemeProvider generateClassName={generateClassName} theme={theme}>
      <TableWrapper {...props} columnRenderers={columnRenderers} />
    </ThemeProvider>,
    element
  );
}

export function teardown(element) {
  ReactDOM.unmountComponentAtNode(element);
}
