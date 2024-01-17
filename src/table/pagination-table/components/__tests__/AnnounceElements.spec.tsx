import { render } from "@testing-library/react";
import React from "react";
import AnnounceElements from "../AnnounceElements";

describe("<AnnounceElements />", () => {
  it("should render the Announce component properly", () => {
    const result = render(<AnnounceElements />);
    const firstAnnounceElement = result.container.querySelector(".sn-table-announcer-1");
    const secondAnnounceElement = result.container.querySelector(".sn-table-announcer-2");

    expect(firstAnnounceElement).toBeVisible();
    expect(secondAnnounceElement).toBeVisible();
  });
});
