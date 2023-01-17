import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MenuGroup from '../MenuGroup';
import { MenuGroupProps } from '../../../types';
import { ExtendedSelectionAPI } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<MenuGroup />', () => {
  let selectionsAPI: ExtendedSelectionAPI;
  const direction: 'ltr' | 'rtl' = 'ltr';
  let menuGroup: MenuGroupProps;

  const renderMenuGroup = (menuGroupProp: MenuGroupProps) =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI} direction={direction}>
        <MenuGroup {...menuGroupProp} />
      </TestWithProviders>
    );

  it('should render given menu group', () => {
    menuGroup = {
      id: 1,
      shouldShowDevider: false,
      options: [
        {
          id: 1,
          itemTitle: 'menu#01',
          onClick: jest.fn(),
          icon: <></>,
          isDisabled: false,
        },
      ],
    };
    renderMenuGroup(menuGroup);
    expect(screen.getAllByRole('button').length).toBe(1);
    expect(screen.getByText('menu#01')).toBeVisible();
    fireEvent.click(screen.getByText('menu#01'));
    expect(menuGroup.options[0].onClick).toHaveBeenCalledTimes(1);
  });
});
