import '../../__tests__/rtl-setup';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as withStyling from '../withStyling';

describe('withStyling', () => {
  const sandbox = sinon.createSandbox();
  let HOC;
  let styling;

  beforeEach(() => {
    // This is a bit of dummy mock. value will be on props, but this is not how the value is set. That is done in tableBodyWrapper
    // But this enables testing that withStyling uses the CellComponent correctly
    HOC = withStyling.default((props) => <div {...props}>{props.value}</div>);

    styling = {};
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render table head', () => {
    const { queryByText } = render(<HOC value="someValue" styling={styling} />);

    expect(queryByText('someValue')).to.be.visible;
  });
});
