import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import TableWrapper from './TableWrapper';

export function render(rootElement, props) {
  const { muiParameters } = props;

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
