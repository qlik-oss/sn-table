import React from 'react';
import { render } from '@testing-library/react';

import * as withStyling from '../withStyling';

describe('withStyling', () => {
  let HOC;
  let styling;

  beforeEach(() => {
    // This is a bit of dummy mock. value will be on props, but this is not how the value is set. That is done in tableBodyWrapper
    // But this enables testing that withStyling uses the CellComponent correctly
    HOC = withStyling.default((props) => <div {...props}>{props.value}</div>);

    styling = {};
  });

  it('should render table head', () => {
    const { queryByText } = render(<HOC value="someValue" styling={styling} />);

    expect(queryByText('someValue')).toBeVisible();
  });
});
