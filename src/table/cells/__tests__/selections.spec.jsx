import '../../../../test-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { withSelections } from '../selections';
import * as selectionsUtils from '../../selections-utils';

describe('withSelections', async () => {
  const sandbox = sinon.createSandbox();
  let HOC;
  let cell;
  let selState;
  let selDispatch;

  beforeEach(() => {
    HOC = withSelections((props) => <div {...props}>{props.cell.value}</div>);
    sandbox.replace(selectionsUtils, 'selectCell', sinon.spy());

    cell = {
      isDim: true,
      value: '100',
    };
    selState = {
      rows: [],
      colIdx: -1,
    };
    selDispatch = () => {};
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = render(<HOC cell={cell} selState={selState} selDispatch={selDispatch} />);

    expect(queryByText(cell.value)).to.be.visible;
  });
  it('should call selectCell on mouseUp', () => {
    const { queryByText } = render(<HOC cell={cell} selState={selState} selDispatch={selDispatch} />);
    fireEvent.mouseUp(queryByText(cell.value));

    expect(selectionsUtils.selectCell).to.have.been.calledWith(cell, selState);
  });

  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = render(<HOC cell={cell} selState={selState} selDispatch={selDispatch} />);
    fireEvent.mouseUp(queryByText(cell.value));

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
});
