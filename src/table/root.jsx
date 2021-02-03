import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import TableWrapper from './table';

export function render(element, props) {
  const { muiParameters } = props;

  ReactDOM.render(
    <StylesProvider generateClassName={muiParameters.generateClassName}>
      <ThemeProvider theme={muiParameters.theme}>
        <TableWrapper {...props} />
      </ThemeProvider>
    </StylesProvider>,
    element
  );
}

export function teardown(element) {
  ReactDOM.unmountComponentAtNode(element);
}
