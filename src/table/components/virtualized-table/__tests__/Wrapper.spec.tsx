import React from 'react';
import { render } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';

import Wrapper from '../Wrapper';
import { ExtendedSelectionAPI, ExtendedTheme, ExtendedTranslator, TableLayout } from '../../../../types';
import TableContainer from '../TableContainer';
import FooterWrapper from '../../FooterWrapper';
import { MAX_PAGE_SIZE } from '../constants';

jest.mock('../TableContainer');
jest.mock('../../FooterWrapper');

describe('<Wrapper />', () => {
  let translator: ExtendedTranslator;
  let rect: stardust.Rect;
  let theme: ExtendedTheme;
  let layout: TableLayout;
  let keyboard: stardust.Keyboard;
  let model: EngineAPI.IGenericObject;
  let selectionsAPI: ExtendedSelectionAPI;
  const mockTableContainer = TableContainer as jest.MockedFunction<typeof TableContainer>;
  mockTableContainer.mockReturnValue(<div data-testid="table-container" />);
  const mockFooterWrapper = FooterWrapper as jest.MockedFunction<typeof FooterWrapper>;
  mockFooterWrapper.mockReturnValue(<div data-testid="footer-wrapper" />);

  const renderWrapper = () =>
    render(
      <Wrapper
        model={model}
        translator={translator}
        rect={rect}
        theme={theme}
        layout={layout}
        keyboard={keyboard}
        selectionsAPI={selectionsAPI}
      />
    );

  beforeEach(() => {
    layout = {
      qHyperCube: {
        qSize: {
          qcx: 10,
          qcy: 20,
        },
      },
    } as TableLayout;
    keyboard = { enabled: false, active: false };
    translator = { get: (s: string) => s } as unknown as ExtendedTranslator;
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
    theme = {
      getStyle: () => undefined,
      table: {
        body: { borderColor: '' },
        pagination: { borderColor: '' },
      },
    } as unknown as ExtendedTheme;
  });

  afterEach(() => jest.clearAllMocks());

  it('should not render table with pagination', () => {
    layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE - 1;
    const { queryByTestId, getByTestId } = renderWrapper();

    expect(getByTestId('table-container')).toBeVisible();
    expect(queryByTestId('footer-wrapper')).toBeNull();
    expect(mockTableContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        pageInfo: expect.objectContaining({ rowsPerPage: MAX_PAGE_SIZE - 1 }),
      }),
      expect.anything()
    );
  });

  it('should render table with pagination', () => {
    layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE + 1;
    const { getByTestId } = renderWrapper();

    expect(getByTestId('table-container')).toBeVisible();
    expect(getByTestId('footer-wrapper')).toBeVisible();
    expect(mockTableContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        pageInfo: expect.objectContaining({ rowsPerPage: MAX_PAGE_SIZE }),
      }),
      expect.anything()
    );
  });
});
