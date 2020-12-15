import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';
import { sproutBase } from '@qlik/sprout-theme';
import TheTable from './component';
import getCellRenderer from './cells/renderer';

export function render(element, props) {
  const { constraints, tableData } = props;
  sproutBase.overrides.MuiTableContainer.root.height = 'calc(100% - 52px)';
  sproutBase.overrides.MuiTableContainer.root.overflow = !constraints.active ? 'auto' : 'hidden';
  sproutBase.overrides.MuiPaper = { root: { height: '100%' } };

  const columnRenderers = tableData.columns.map(getCellRenderer);

  function generateRandomString(keyLength) {
    let result = '';
    let i;
    let j;

    for (i = 0; i < keyLength; i++) {
      j = Math.floor(Math.random() * 62);
      if (j < 10) {
        result += j;
      } else if (j > 9 && j < 36) {
        result += String.fromCharCode(j + 55);
      } else {
        result += String.fromCharCode(j + 61);
      }
    }

    return result;
  }

  const generateClassName = createGenerateClassName({
    productionPrefix: 'sn-t',
    disableGlobal: true,
    seed: generateRandomString(6),
  });

  const theme = createMuiTheme(sproutBase);
  ReactDOM.render(
    <ThemeProvider generateClassName={generateClassName} theme={theme}>
      <TheTable {...props} columnRenderers={columnRenderers} />
    </ThemeProvider>,
    element
  );
}

export function teardown(element) {
  ReactDOM.unmountComponentAtNode(element);
}
