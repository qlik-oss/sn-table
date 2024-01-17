import { render, screen } from "@testing-library/react";
import React from "react";
import { MenuItemGroup } from "../../../../types";
import MenuGroupWrapper from "../MenuGroupWrapper";

describe("<MenuGroupWrapper />", () => {
  const renderer = (itemGroups: MenuItemGroup[]) => {
    render(<MenuGroupWrapper itemGroups={itemGroups} />);
  };

  it("should render menu group without divider", () => {
    renderer([[{ id: 1, icon: <i />, itemTitle: "Menu#01", enabled: true }]]);
    expect(screen.queryByText("Menu#01")).toBeVisible();
    expect(screen.queryByTestId("group-divider")).not.toBeInTheDocument();
  });

  it("should render menu group without divider2", () => {
    renderer([
      [{ id: 1, icon: <i />, itemTitle: "Menu#01", enabled: true }],
      [{ id: 2, icon: <i />, itemTitle: "Menu#02", enabled: true }],
    ]);
    expect(screen.queryByText("Menu#01")).toBeVisible();
    expect(screen.queryByText("Menu#02")).toBeVisible();
    expect(screen.getByTestId("group-divider")).toBeVisible();
  });
});
