import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import muiSetup from '../mui-setup';
import TableWrapper from './TableWrapper';

// This line is replaced by rollup with an import for internal builds
const __OPIONAL_THEME_DEPS__ = {}; // eslint-disable-line no-underscore-dangle

export function render(rootElement, props) {
  const muiParameters = muiSetup(__OPIONAL_THEME_DEPS__);

  ReactDOM.render(
    <StylesProvider generateClassName={muiParameters.generateClassName}>
      <ThemeProvider theme={muiParameters.theme}>
        <TableWrapper {...props} />
      </ThemeProvider>
    </StylesProvider>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
