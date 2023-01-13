import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { ChangeSortOrder, Column, ExtendedTranslator, SortDirection, TableLayout } from '../../../types';
import { GeneratedStyling } from '../../types';
import HeadCellMenu from '../head/HeadCellMenu';
import CellText from '../CellText';

interface HeaderCellProps {
  index: number;
  style: React.CSSProperties;
  data: {
    columns: Column[];
    headerStyle: GeneratedStyling;
    layout: TableLayout;
    embed: stardust.Embed;
    translator: ExtendedTranslator;
    changeSortOrder: ChangeSortOrder;
    isInteractionEnabled: boolean;
    rootElement: HTMLElement;
  };
}

const StyledHeaderCell = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'borderWidth',
})(({ borderWidth }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderStyle: 'solid',
  borderWidth,
  padding: '4px 12px',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxSizing: 'border-box',
  '&&:hover': {
    '& button, & svg': { opacity: 1 },
  },
  fontWeight: 'bold',
}));

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const { columns, headerStyle, embed, layout, translator, changeSortOrder, isInteractionEnabled, rootElement } = data;
  const { sortLabelColor, ...applicableStyle } = headerStyle;
  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;

  const sortFromMenu = (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    changeSortOrder(column, newSortDirection);
  };

  return (
    <StyledHeaderCell
      style={{ ...style, ...applicableStyle }}
      borderWidth={isLastColumn ? '0px' : '0px 1px 0px 0px'}
      className="sn-table-cell"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: column.align,
          cursor: 'default',
          width: '100%',
        }}
      >
        <CellText singleLine>{column.label}</CellText>
      </div>
      <HeadCellMenu
        headerStyle={headerStyle}
        translator={translator}
        sortFromMenu={sortFromMenu}
        embed={embed}
        layout={layout}
        columnIndex={column.colIdx}
        sortDirection={column.sortDirection}
        isInteractionEnabled={isInteractionEnabled}
        isCurrentColumnActive={isCurrentColumnActive}
        isDimension={column.isDim}
        container={rootElement}
      />
    </StyledHeaderCell>
  );
};

export default HeaderCell;
