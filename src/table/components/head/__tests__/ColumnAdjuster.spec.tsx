import { stardust } from "@nebula.js/stardust";
import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import { render, screen } from "@testing-library/react";
import React from "react";
import TestWithProviders from "../../../../__test__/test-with-providers";
import { Column } from "../../../../types";
import ColumnAdjuster from "../ColumnAdjuster";

describe("<ColumnAdjuster />", () => {
  let columns: Column[];
  let interactions: stardust.Interactions;

  const renderAdjuster = () => {
    render(
      <TestWithProviders interactions={interactions}>
        <ColumnAdjuster column={columns[0]} isLastColumn={false} />
      </TestWithProviders>
    );
    return screen.queryByTestId(COLUMN_ADJUSTER_CLASS) as HTMLElement;
  };

  beforeEach(() => {
    columns = [{} as Column, {} as Column];
    interactions = {
      active: true,
      passive: true,
      select: true,
    };
  });

  afterEach(() => jest.clearAllMocks());

  it("should return null when interactions.active is false", () => {
    interactions.active = false;

    const columnAdjuster = renderAdjuster();
    expect(columnAdjuster).toBeNull();
  });

  it("should render when interactions.active is not false", () => {
    const columnAdjuster = renderAdjuster();
    expect(columnAdjuster).toBeInTheDocument();
  });
});
