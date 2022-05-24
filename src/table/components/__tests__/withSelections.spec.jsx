import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TableContextProvider } from '../../context';
import * as withSelections from '../withSelections';

describe('withSelections', () => {
  const selectionsAPI = { isModal: () => false };
  let HOC;
  let value;
  let cell;
  let evt;
  let styling;
  let announce;
  let theme;
  let themeBackgroundColor;
  let selectionDispatchMock;

  const renderWithSelections = () =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} selectionDispatchMock={selectionDispatchMock}>
        <HOC
          value={value}
          cell={cell}
          styling={styling}
          theme={theme}
          announce={announce}
          themeBackgroundColor={themeBackgroundColor}
        />
      </TableContextProvider>
    );

  beforeEach(() => {
    HOC = withSelections.default((props) => <div {...props}>{props.value}</div>);

    value = '100';
    cell = {
      isDim: true,
    };
    evt = { button: 0 };
    styling = {};
    announce = jest.fn();
    theme = {
      getStyle: () => {},
    };
    themeBackgroundColor = '#123456';
    selectionDispatchMock = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = renderWithSelections();

    expect(queryByText(value)).toBeVisible();
  });

  it('should call selectCell on mouseUp', () => {
    const { queryByText } = renderWithSelections();
    fireEvent.mouseUp(queryByText(value));

    expect(selectionDispatchMock).toHaveBeenCalledTimes(1);
    expect(selectionDispatchMock).toHaveBeenCalledWith({
      type: 'select',
      payload: { cell, evt: expect.anything(), announce },
    });
  });

  it('should not call selectCell on mouseUp when measure', () => {
    cell.isDim = false;

    const { queryByText } = renderWithSelections();
    fireEvent.mouseUp(queryByText(value));

    expect(selectionDispatchMock).not.toHaveBeenCalled();
  });

  it('should not call selectCell on mouseUp when right button', () => {
    evt.button = 2;

    const { queryByText } = renderWithSelections();
    fireEvent.mouseUp(queryByText(value), evt);

    expect(selectionDispatchMock).not.toHaveBeenCalled();
  });
});
