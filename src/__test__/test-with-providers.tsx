/* eslint react/require-default-props: 0 */
import { ThemeProvider } from '@mui/system';
import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { TableContextProvider } from '../table/context';
import muiSetup from '../table/mui-setup';
import { ExtendedSelectionAPI, ExtendedTheme, ExtendedTranslator, Row, TableLayout } from '../types';
import { generateLayout } from './generate-test-data';

interface ProviderProps {
  children?: JSX.Element;
  selectionsAPI?: ExtendedSelectionAPI;
  pageRows?: Row[];
  cellCoordMock?: [number, number];
  selectionDispatchMock?: jest.Mock<any, any>;
  layout?: TableLayout;
  model?: EngineAPI.IGenericObject;
  translator?: ExtendedTranslator;
  constraints?: stardust.Constraints;
  theme?: ExtendedTheme;
  keyboard?: stardust.Keyboard;
  direction?: 'ltr' | 'rtl';
}

const TestWithProviders = ({
  children,
  layout = generateLayout(1, 1, 5),
  constraints = {} as stardust.Constraints,
  selectionsAPI = { isModal: () => false } as ExtendedSelectionAPI,
  model = {
    getHyperCubeData: () => Promise.resolve(),
  } as unknown as EngineAPI.IGenericObject,
  keyboard = {} as stardust.Keyboard,
  translator = { get: (s: string) => s } as unknown as ExtendedTranslator,
  theme = {
    getColorPickerColor: () => undefined,
    name: () => undefined,
    getStyle: () => undefined,
    background: { isDark: false },
  } as unknown as ExtendedTheme,
  pageRows = undefined,
  cellCoordMock = undefined,
  selectionDispatchMock = undefined, // Need to mock selectionDispatch since UPDATE_PAGE_ROWS action can create infinite loop
  direction = 'ltr',
}: ProviderProps) => {
  return (
    <ThemeProvider theme={muiSetup(direction)}>
      <TableContextProvider
        selectionsAPI={selectionsAPI}
        layout={layout}
        translator={translator}
        constraints={constraints}
        theme={theme}
        keyboard={keyboard}
        model={model}
        pageRows={pageRows}
        cellCoordMock={cellCoordMock}
        selectionDispatchMock={selectionDispatchMock}
      >
        {children as JSX.Element}
      </TableContextProvider>
    </ThemeProvider>
  );
};

export default TestWithProviders;
