import { styled } from "@mui/material";
import React from "react";
import { Column } from "../../types";
import CellText from "../components/CellText";
import ColumnAdjusterWrapper from "../components/head/ColumnAdjusterWrapper";
import HeadCellContent from "../components/head/HeadCellContent";
import { TableContext, useContextSelector } from "../context";
import { useHeadCellDim } from "../hooks/use-head-cell-dim";
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
  shouldForwardProp: (prop: string) =>
    prop !== "interactions" &&
    prop !== "hoverBackground" &&
    prop !== "background" &&
    prop !== "applicableStyle" &&
    prop !== "isNewHeadCellMenuEnabled",
})(({ isNewHeadCellMenuEnabled, interactions, hoverBackground, background, applicableStyle }) => ({
  ...applicableStyle,
  ...(isNewHeadCellMenuEnabled && { background }),

  "&&:hover": {
    ...(isNewHeadCellMenuEnabled && { background: interactions.active ? hoverBackground : background }),
  },
}));

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
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
  const isNewHeadCellMenuEnabled = useContextSelector(
    TableContext,
    (value) => value.featureFlags.isNewHeadCellMenuEnabled,
  );
  const isInteractionEnabled = !!interactions.active && !isSelectionMode;
  const { open, setOpen, handleOpenMenu, setIsAdjustingWidth } = useHeadCellDim({
    isInteractionEnabled,
    columnsData: columns,
  });

  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const flexDirection = column.headTextAlign === "right" ? "row-reverse" : "row";

  return (
    <StyledHeadCell
      className="sn-table-cell"
      title={interactions.passive ? column.label : undefined}
      onClick={handleOpenMenu}
      applicableStyle={applicableStyle}
      style={{
        ...style,
        ...(isNewHeadCellMenuEnabled ? { cursor: "pointer" } : { cursor: "default" }),
        display: "flex",
        alignItems: "flex-end",
        borderStyle: "solid",
        borderWidth: isLastColumn && !showRightBorder ? "0px 0px 1px 0px" : "0px 1px 1px 0px",
        padding: "4px",
        justifyContent: column.headTextAlign,
        boxSizing: "border-box",
        zIndex: columns.length - index,
        flexDirection,
        userSelect: "none",
      }}
      interactions={interactions}
      hoverBackground={hoverBackground}
      background={open ? activeBackground : background}
      isNewHeadCellMenuEnabled={isNewHeadCellMenuEnabled}
    >
      <HeadCellContent column={column} isInteractionEnabled={isInteractionEnabled} open={open} setOpen={setOpen}>
        <CellText wordBreak lines={3}>
          {column.label}
        </CellText>
      </HeadCellContent>
      <ColumnAdjusterWrapper
        column={column}
        isLastColumn={isLastColumn}
        onColumnResize={columResizeHandler}
        setIsAdjustingWidth={setIsAdjustingWidth}
      />
    </StyledHeadCell>
  );
};

export default HeaderCell;
