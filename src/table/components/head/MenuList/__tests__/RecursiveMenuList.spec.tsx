import React from 'react';
import { render } from '@testing-library/react';
import RecursiveMenuList from '../RecursiveMenuList';
import * as MenuGroupWrapper from '../MenuGroupWrapper';
import { MenuItemGroup } from '../../../../types';

describe('<RecursiveMenuList />', () => {
  let menuGroups: MenuItemGroup[];
  let menuGroupWrapperMock: jest.Mock<any, any>;
  let anchorEl: HTMLDivElement;

  beforeEach(() => {
    anchorEl = document.createElement('div');
    menuGroupWrapperMock = jest.fn();
    jest.spyOn(MenuGroupWrapper, 'default').mockImplementation(menuGroupWrapperMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call `MenuGroupWrapper` with proper arguments', () => {
    menuGroups = [
      [{ id: 1, icon: <i />, itemTitle: 'Menu#01', enabled: true }],
      [{ id: 2, icon: <i />, itemTitle: 'Menu#02', enabled: true }],
    ];
    render(<RecursiveMenuList open anchorEl={anchorEl} onClose={() => {}} menuGroups={menuGroups} />);

    expect(menuGroupWrapperMock).toHaveBeenCalledTimes(1);
    expect(menuGroupWrapperMock).toHaveBeenCalledWith({ itemGroups: menuGroups });
  });

  it('should not call `MenuGroupWrapper` when there are no menuGroups', () => {
    menuGroups = [];
    render(<RecursiveMenuList open anchorEl={anchorEl} onClose={() => {}} menuGroups={menuGroups} />);

    expect(menuGroupWrapperMock).toHaveBeenCalledTimes(0);
  });
});
