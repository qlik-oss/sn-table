import ReactDOM from 'react-dom';
import React from 'react';
import { StylesProvider } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import TableWrapper from './components/TableWrapper';
import muiSetup from '../mui-setup';

export function render(rootElement, props) {
  ReactDOM.render(
    <React.StrictMode>
      <StylesProvider generateClassName={muiSetup().generateClassName}>
        <ThemeProvider theme={muiSetup().theme}>
          <TableWrapper {...props} />
        </ThemeProvider>
      </StylesProvider>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
