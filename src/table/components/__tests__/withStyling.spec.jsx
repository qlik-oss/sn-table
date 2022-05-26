import React from 'react';
import { render } from '@testing-library/react';

import * as withStyling from '../withStyling';

describe('withStyling', () => {
  let HOC;
  let styling;

  beforeEach(() => {
    HOC = withStyling.default((props) => <div {...props}>{props.children}</div>);

    styling = {};
  });

  it('should render table cell', () => {
    const { queryByText } = render(<HOC styling={styling}>someValue</HOC>);

    expect(queryByText('someValue')).toBeVisible();
  });
});
