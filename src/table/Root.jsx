import ReactDOM from 'react-dom';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { StylesProvider } from '@mui/styles';
import TableWrapper from './components/TableWrapper';

export function render(rootElement, props) {
  const { muiParameters, direction } = props;
  const isRTL = direction === 'rtl';
  // Create rtl cache
  const cacheRtl = createCache({
    key: isRTL ? 'muirtl' : 'muiltr',
    stylisPlugins: isRTL ? [rtlPlugin] : [],
  });

  ReactDOM.render(
    <React.StrictMode>
      <CacheProvider value={cacheRtl}>
        <StylesProvider generateClassName={muiParameters.generateClassName}>
          <ThemeProvider theme={muiParameters.theme}>
            <TableWrapper {...props} />
          </ThemeProvider>
        </StylesProvider>
      </CacheProvider>
    </React.StrictMode>,
    rootElement
  );
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}
