import Ascending from "@qlik-trial/sprout/icons/react/Ascending";
import Descending from "@qlik-trial/sprout/icons/react/Descending";
import Lock from "@qlik-trial/sprout/icons/react/Lock";
import React from "react";
import { Column } from "../../types";
import { LockWrapper } from "../components/head/styles";
import { DEFAULT_FONT_SIZE } from "../styling-defaults";

const getHeadIcons = ({ sortDirection, isLocked, headTextAlign }: Column) => {
  const sortIcon =
    sortDirection === "A" ? <Ascending height={DEFAULT_FONT_SIZE} /> : <Descending height={DEFAULT_FONT_SIZE} />;
  const lockIcon = isLocked ? (
    <LockWrapper className={`aligned-${headTextAlign}`}>
      <Lock height={DEFAULT_FONT_SIZE} data-testid="head-cell-lock-icon" />
    </LockWrapper>
  ) : undefined;
  return headTextAlign === "right" ? { startIcon: sortIcon, lockIcon } : { endIcon: sortIcon, lockIcon };
};

export default getHeadIcons;
