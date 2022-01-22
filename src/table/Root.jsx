import ReactDOM from 'react-dom';
import React from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@mui/styles';
import TableWrapper from './components/TableWrapper';

// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
});

export function render(rootElement, props) {
  const { muiParameters } = props;

  ReactDOM.render(
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <StylesProvider jss={jss} generateClassName={muiParameters.generateClassName}>
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
