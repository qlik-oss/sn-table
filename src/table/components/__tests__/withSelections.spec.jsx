import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import * as withSelections from '../withSelections';

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

    value = '100';
    cell = {
      isDim: true,
    };
    selectionState = {
      rows: [],
      colIdx: -1,
      api: { isModal: () => true },
    };
    selectionDispatch = jest.fn();
    evt = { button: 0 };
    styling = {};
    announce = jest.fn();
    theme = {
      getStyle: () => {},
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = render(
      <HOC
        value={value}
        selectionState={selectionState}
        cell={cell}
        selectionDispatch={selectionDispatch}
        styling={styling}
        theme={theme}
        announce={announce}
      />
    );

    expect(queryByText(value)).toBeVisible();
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

    expect(selectionDispatch).toHaveBeenCalledTimes(1);
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
        announce={announce}
      />
    );
    fireEvent.mouseUp(queryByText(value));

    expect(selectionDispatch).not.toHaveBeenCalled();
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
        announce={announce}
      />
    );
    fireEvent.mouseUp(queryByText(value), evt);

    expect(selectionDispatch).not.toHaveBeenCalled();
  });
});
