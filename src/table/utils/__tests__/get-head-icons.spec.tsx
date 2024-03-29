import Ascending from "@qlik-trial/sprout/icons/react/Ascending";
import Descending from "@qlik-trial/sprout/icons/react/Descending";
import Lock from "@qlik-trial/sprout/icons/react/Lock";
import React from "react";

import { Column } from "../../../types";
import { LockWrapper } from "../../components/head/styles";
import { DEFAULT_FONT_SIZE } from "../../styling-defaults";
import getHeadIcons from "../get-head-icons";

describe("get-head-icons", () => {
  const ascending = <Ascending height={DEFAULT_FONT_SIZE} />;
  const descending = <Descending height={DEFAULT_FONT_SIZE} />;
  const lock = (
    <LockWrapper className="aligned-left">
      <Lock height="12px" data-testid="head-cell-lock-icon" />
    </LockWrapper>
  );
  let column: Column;

  beforeEach(() => {
    column = {
      sortDirection: "A",
      isLocked: false,
      headTextAlign: "left",
    } as Column;
  });

  it("should return ascending as endIcon and no lock icon when sortDirection i A and align is left", () => {
    const icons = getHeadIcons(column);
    expect(icons).toEqual({ endIcon: ascending, lockIcon: undefined });
  });

  it("should return descending as endIcon and no lock icon when sortDirection i D and align is left", () => {
    column.sortDirection = "D";

    const icons = getHeadIcons(column);
    expect(icons).toEqual({ endIcon: descending, lockIcon: undefined });
  });

  it("should return ascending as endIcon and no lock icon when sortDirection i A and align is right", () => {
    column.headTextAlign = "right";

    const icons = getHeadIcons(column);
    expect(icons).toEqual({ startIcon: ascending, lockIcon: undefined });
  });

  it("should return descending as endIcon and no lock icon when sortDirection i D and align is right", () => {
    column.headTextAlign = "right";
    column.sortDirection = "D";

    const icons = getHeadIcons(column);
    expect(icons).toEqual({ startIcon: descending, lockIcon: undefined });
  });

  it("should return defined lock icon when isLocked is true", () => {
    column.isLocked = true;

    const { lockIcon } = getHeadIcons(column);
    expect(lockIcon).toEqual(lock);
  });
});
