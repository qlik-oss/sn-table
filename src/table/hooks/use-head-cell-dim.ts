import { useState } from "react";
import { Column } from "../../types";
import isEventFromColumnAdjuster from "../utils/is-event-from-column-adjuster";
import useIsAdjustingWidth from "./use-is-adjusting-width";

interface UseHeadCellDim {
  isInteractionEnabled: boolean;
  columnsData: Column[];
}

export const useHeadCellDim = ({ isInteractionEnabled, columnsData }: UseHeadCellDim) => {
  const [open, setOpen] = useState(false);
  const { isAdjustingWidth, setIsAdjustingWidth } = useIsAdjustingWidth([columnsData]);

  const handleOpenMenu = (evt: React.KeyboardEvent) =>
    isInteractionEnabled && !isEventFromColumnAdjuster(evt) && !isAdjustingWidth && setOpen(true);

  return { open, setOpen, handleOpenMenu, setIsAdjustingWidth };
};
