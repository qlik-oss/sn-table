import TableCell from "@mui/material/TableCell";
import { render } from "@testing-library/react";
import React from "react";

import TestWithProviders from "../../../../../__test__/test-with-providers";
import { Announce, Cell, Column, ExtendedSelectionAPI } from "../../../../../types";
import { CellHOCProps, CellStyle } from "../../../../types";
import withSelections from "../withSelections";

describe("withSelections", () => {
  const value = "100";
  const selectionsAPI = { isModal: () => false } as unknown as ExtendedSelectionAPI;
  let HOC: (props: CellHOCProps) => JSX.Element;
  let cell: Cell;
  let styling: CellStyle;
  let announce: Announce;
  let column: Column;

  const renderWithSelections = () =>
    render(
      <TestWithProviders selectionsAPI={selectionsAPI}>
        <table>
          <tbody>
            <tr>
              <HOC cell={cell} styling={styling} announce={announce} column={column}>
                {value}
              </HOC>
            </tr>
          </tbody>
        </table>
      </TestWithProviders>
    );

  beforeEach(() => {
    HOC = withSelections((props: CellHOCProps) => <TableCell>{props.children}</TableCell>);
    cell = {
      isSelectable: true,
    } as unknown as Cell;
    styling = {} as unknown as CellStyle;
    announce = () => undefined as unknown as Announce;
  });

  afterEach(() => jest.clearAllMocks());

  it("should render a mocked component with the passed value", () => {
    const { queryByText } = renderWithSelections();

    expect(queryByText(value)).toBeVisible();
  });
});
