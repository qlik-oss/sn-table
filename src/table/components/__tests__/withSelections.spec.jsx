import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as withSelections from '../withSelections';
import * as selectionsUtils from '../../utils/selections-utils';

describe('withSelections', () => {
  let HOC;
  let value;
  let cell;
  let selectionState;
  let selectionDispatch;
  let evt;
  let styling;
  let announce;
  let theme;

  beforeEach(() => {
    HOC = withSelections.default((props) => <div {...props}>{props.value}</div>);
    sinon.stub(selectionsUtils, 'selectCell').returns(sinon.spy());

    value = '100';
    cell = {
      isDim: true,
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
    theme = {
      getStyle: () => {},
    };
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        theme={theme}
      />
    );

    expect(queryByText(value)).to.be.visible;
  });
  it('should call selectCell on mouseUp', () => {
    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        announce={announce}
        theme={theme}
      />
    );
    fireEvent.mouseUp(queryByText(value));

    expect(selectionsUtils.selectCell).to.have.been.calledWithMatch({ selectionState, cell, evt, announce });
  });
  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        theme={theme}
      />
    );
    fireEvent.mouseUp(queryByText(value));

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        theme={theme}
      />
    );
    fireEvent.mouseUp(queryByText(value), evt);

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
  it('should not call selectCell on mouseUp when right button', () => {
    evt.button = 2;

    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        theme={theme}
      />
    );
    fireEvent.mouseUp(queryByText(value), evt);

    expect(selectionsUtils.selectCell).to.not.have.been.called;
  });
});
