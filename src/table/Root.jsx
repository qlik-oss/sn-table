import ReactDOM from 'react-dom';
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import rtlPluginSc from 'stylis-plugin-rtl-sc';
import TableWrapper from './components/TableWrapper';

export function render(rootElement, props) {
  const { muiParameters, direction } = props;

  ReactDOM.render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <StyleSheetManager stylisPlugins={direction === 'rtl' ? [rtlPluginSc] : []}>
          <StylesProvider generateClassName={muiParameters.generateClassName}>
            <ThemeProvider theme={muiParameters.theme}>
              <TableWrapper {...props} />
            </ThemeProvider>
          </StylesProvider>
        </StyleSheetManager>
      </StyledEngineProvider>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
