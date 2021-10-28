import ReactDOM from 'react-dom';
import React from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import TableWrapper from './components/TableWrapper';

export function render(rootElement, props) {
  const { muiParameters } = props;

  ReactDOM.render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <StylesProvider generateClassName={muiParameters.generateClassName}>
          <ThemeProvider theme={muiParameters.theme}>
            <TableWrapper {...props} />
          </ThemeProvider>
        </StylesProvider>
      </StyledEngineProvider>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
