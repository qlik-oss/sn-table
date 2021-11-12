import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Announce from '../Announce';

describe('<Announce />', () => {
  it('should render the Announce component properly', () => {
    const result = render(<Announce />);
    const firstAnnounceElement = result.container.querySelector('#sn-table-announcer--01');
    const secondAnnounceElement = result.container.querySelector('#sn-table-announcer--02');

    expect(firstAnnounceElement).to.be.visible;
    expect(secondAnnounceElement).to.be.visible;
  });
});
