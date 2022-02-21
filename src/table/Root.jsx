import ReactDOM from 'react-dom';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';

export function render(rootElement, props) {
  const { muiTheme, direction } = props;

  ReactDOM.render(
    <React.StrictMode>
      <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : []}>
        <ThemeProvider theme={muiTheme}>
          <TableWrapper {...props} />
        </ThemeProvider>
      </StyleSheetManager>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
