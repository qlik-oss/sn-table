import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AnnounceElements from '../AnnounceElements';

describe('<AnnounceElements />', () => {
  it('should render the Announce component properly', () => {
    const result = render(<AnnounceElements />);
    const firstAnnounceElement = result.container.querySelector('#sn-table-announcer--01');
    const secondAnnounceElement = result.container.querySelector('#sn-table-announcer--02');

    expect(firstAnnounceElement).to.be.visible;
    expect(secondAnnounceElement).to.be.visible;
  });
});
