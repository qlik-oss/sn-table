import ReactDOM from 'react-dom';
import React from 'react';
import { StylesProvider } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import TableWrapper from './TableWrapper';

export function render(rootElement, props) {
  const { muiParameters } = props;

  ReactDOM.render(
    <React.StrictMode>
      <StylesProvider generateClassName={muiParameters.generateClassName}>
        <ThemeProvider theme={muiParameters.theme}>
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
