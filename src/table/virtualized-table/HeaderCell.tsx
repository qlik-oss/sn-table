import { styled } from "@mui/material";
import React, { useState } from "react";
import { Column } from "../../types";
import CellText from "../components/CellText";
import ColumnAdjusterWrapper from "../components/head/ColumnAdjusterWrapper";
import HeadCellContent from "../components/head/HeadCellContent";
import { TableContext, useContextSelector } from "../context";
import { GeneratedStyling } from "../types";

interface HeaderCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
    columResizeHandler: () => void;
  };
}

export const StyledHeadCell = styled("div", {
  shouldForwardProp: (prop) =>
    ![
      "isNewHeadCellMenuEnabled",
      "interactions",
      "hoverBackground",
      "background",
      "zIndex",
      "flexDirection",
      "justifyContent",
      "isLastColumn",
      "showRightBorder",
      "applicableStyle",
    ].includes(prop as string),
})(
  ({
    isNewHeadCellMenuEnabled,
    interactions,
    hoverBackground,
    background,
    zIndex,
    flexDirection,
    justifyContent,
    isLastColumn,
    showRightBorder,
    applicableStyle,
  }) => ({
    ...(isNewHeadCellMenuEnabled && { cursor: "pointer" }),
    ...applicableStyle,
    display: "flex",
    alignItems: "flex-end",
    borderStyle: "solid",
    borderWidth: isLastColumn && !showRightBorder ? "0px 0px 1px 0px" : "0px 1px 1px 0px",
    padding: "4px",
    boxSizing: "border-box",
    cursor: "pointer",
    userSelect: "none",
    zIndex,
    flexDirection,
    justifyContent,
    background,

    "&:focus": {
      boxShadow: "none",
    },

    "&&:hover": {
      background: interactions.active ? hoverBackground : background,
    },
  })
);

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const [open, setOpen] = useState(false);

  const {
    columns,
    headerStyle: { ...applicableStyle },
    columResizeHandler,
  } = data;

  const {
    interactions,
    styling: {
      head: { activeBackground, background, hoverBackground },
    },
  } = useContextSelector(TableContext, (value) => value.baseProps);
  const isSelectionMode = useContextSelector(TableContext, (value) => value.baseProps.selectionsAPI?.isModal());
  const showRightBorder = useContextSelector(TableContext, (value) => value.showRightBorder);

  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isInteractionEnabled = !!interactions.active && !isSelectionMode;
  const flexDirection = column.headTextAlign === "right" ? "row-reverse" : "row";

  const handleOpenMenu = () => setOpen(true);

  return (
    <StyledHeadCell
      className="sn-table-cell"
      title={interactions.passive ? column.label : undefined}
      onClick={handleOpenMenu}
      style={style}
      applicableStyle={applicableStyle}
      interactions={interactions}
      background={open ? activeBackground : background}
      hoverBackground={hoverBackground}
      zIndex={columns.length - index}
      flexDirection={flexDirection}
      justifyContent={column.headTextAlign}
      isLastColumn={isLastColumn}
      showRightBorder={showRightBorder}
    >
      <HeadCellContent column={column} isInteractionEnabled={isInteractionEnabled} open={open} setOpen={setOpen}>
        <CellText wordBreak lines={3}>
          {column.label}
        </CellText>
      </HeadCellContent>
      <ColumnAdjusterWrapper column={column} isLastColumn={isLastColumn} onColumnResize={columResizeHandler} />
    </StyledHeadCell>
  );
};

export default HeaderCell;
