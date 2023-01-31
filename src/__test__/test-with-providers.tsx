/* eslint react/require-default-props: 0 */
import { ThemeProvider } from '@mui/system';
import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { TableContextProvider } from '../table/context';
import muiSetup from '../table/mui-setup';
import {
  ChangeSortOrder,
  ExtendedSelectionAPI,
  ExtendedTheme,
  ExtendedTranslator,
  TableData,
  TableLayout,
} from '../types';
import { generateLayout } from './generate-test-data';

interface ProviderProps {
  children?: JSX.Element;
  selectionsAPI?: ExtendedSelectionAPI;
  tableData?: TableData;
  cellCoordMock?: [number, number];
  selectionDispatchMock?: jest.Mock<any, any>;
  layout?: TableLayout;
  model?: EngineAPI.IGenericObject;
  translator?: ExtendedTranslator;
  constraints?: stardust.Constraints;
  theme?: ExtendedTheme;
  keyboard?: stardust.Keyboard;
  direction?: 'ltr' | 'rtl';
  rootElement?: HTMLElement;
  embed?: stardust.Embed;
  changeSortOrder?: ChangeSortOrder;
  updateColumnWidth?: () => void;
  tableWidth?: number;
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
  tableData = undefined,
  cellCoordMock = undefined,
  selectionDispatchMock = undefined, // Can be used to avoid selectionDispatch infinite loop
  direction = 'ltr',
  rootElement = {} as HTMLElement,
  embed = {} as stardust.Embed,
  changeSortOrder = async () => {},
  updateColumnWidth = () => {},
  tableWidth = 0,
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
        tableData={tableData}
        cellCoordMock={cellCoordMock}
        selectionDispatchMock={selectionDispatchMock}
        rootElement={rootElement}
        embed={embed}
        changeSortOrder={changeSortOrder}
        updateColumnWidth={updateColumnWidth}
        tableWidth={tableWidth}
      >
        {children as JSX.Element}
      </TableContextProvider>
    </ThemeProvider>
  );
};

export default TestWithProviders;
