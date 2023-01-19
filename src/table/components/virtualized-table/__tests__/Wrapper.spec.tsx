import React from 'react';
import { render, screen } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import Wrapper from '../Wrapper';
import { TableLayout } from '../../../../types';
import { TestableTable } from '../Table';
import FooterWrapper from '../../footer/FooterWrapper';
import { MAX_PAGE_SIZE } from '../constants';
import TestWithProviders from '../../../../__test__/test-with-providers';

jest.mock('../Table');
jest.mock('../../footer/FooterWrapper');

describe('<Wrapper />', () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let constraints: stardust.Constraints;
  const mockTable = TestableTable as jest.MockedFunction<typeof TestableTable>;
  mockTable.mockReturnValue(<div data-testid="table-container" />);
  const mockFooterWrapper = FooterWrapper as jest.MockedFunction<typeof FooterWrapper>;
  mockFooterWrapper.mockReturnValue(<div data-testid="footer-wrapper" />);

  const renderWrapper = () =>
    render(
      <TestWithProviders constraints={constraints} layout={layout}>
        <Wrapper rect={rect} />
      </TestWithProviders>
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
    rect = {
      width: 750,
    } as unknown as stardust.Rect;

    constraints = { active: false };
  });

  afterEach(() => jest.clearAllMocks());

  it('should not render table with pagination', () => {
    layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE - 1;
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.queryByTestId('footer-wrapper')).toBeNull();
    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        pageInfo: expect.objectContaining({ rowsPerPage: MAX_PAGE_SIZE - 1 }),
      }),
      expect.anything()
    );
  });

  it('should not render table with pagination when constraints active is enabled', () => {
    constraints.active = true;
    layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE + 1;
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.queryByTestId('footer-wrapper')).toBeNull();
  });

  it('should render table with pagination', () => {
    layout.qHyperCube.qSize.qcy = MAX_PAGE_SIZE + 1;
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.getByTestId('footer-wrapper')).toBeVisible();
    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        pageInfo: expect.objectContaining({ rowsPerPage: MAX_PAGE_SIZE }),
      }),
      expect.anything()
    );
  });
});
