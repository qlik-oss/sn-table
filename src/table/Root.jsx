import ReactDOM from 'react-dom';
import React from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import TableWrapper from './components/TableWrapper';
import muiSetup from '../mui-setup';

export function render(rootElement, props) {
  ReactDOM.render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst generateClassName={muiSetup().generateClassName}>
        <ThemeProvider theme={muiSetup().theme}>
          <TableWrapper {...props} />
        </ThemeProvider>
      </StyledEngineProvider>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
