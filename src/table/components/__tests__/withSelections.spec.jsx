import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as withSelections from '../withSelections';
import * as selectionsUtils from '../../utils/selections-utils';

describe('withSelections', () => {
  let HOC;
  let cell;
  let selectionState;
  let selectionDispatch;
  let evt;
  let styling;
  let announce;

  beforeEach(() => {
    HOC = withSelections.default((props) => <div {...props}>{props.cell.value}</div>);
    sinon.stub(selectionsUtils, 'selectCell').returns(sinon.spy());

    cell = {
      isDim: true,
      value: '100',
    };
    selectionState = {
      rows: [],
      colIdx: -1,
      api: { isModal: () => true },
    };
    selectionDispatch = () => {};
    evt = { button: 0 };
    styling = {};
    announce = sinon.spy();
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = render(
      <HOC selectionstate={selectionState} cell={cell} selectiondispatch={selectionDispatch} styling={styling} />
    );

    expect(queryByText(cell.value)).to.be.visible;
  });
  it('should call selectCell on mouseUp', () => {
    const { queryByText } = render(
      <HOC
        selectionstate={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        announce={announce}
      />
    );
    fireEvent.mouseUp(queryByText(cell.value));

    expect(selectionsUtils.selectCell).to.have.been.calledWithMatch({ selectionState, cell, evt, announce });
  });
  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = render(
      <HOC selectionstate={selectionState} cell={cell} selectiondispatch={selectionDispatch} styling={styling} />
    );
    fireEvent.mouseUp(queryByText(cell.value));

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = render(
      <HOC selectionstate={selectionState} cell={cell} selectiondispatch={selectionDispatch} styling={styling} />
    );
    fireEvent.mouseUp(queryByText(cell.value), evt);

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
  it('should not call selectCell on mouseUp when right button', () => {
    evt.button = 2;

    const { queryByText } = render(
      <HOC selectionstate={selectionState} cell={cell} selectiondispatch={selectionDispatch} styling={styling} />
    );
    fireEvent.mouseUp(queryByText(cell.value), evt);

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
});
