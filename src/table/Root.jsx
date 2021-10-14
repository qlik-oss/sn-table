import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import TableWrapper from './components/TableWrapper';

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
