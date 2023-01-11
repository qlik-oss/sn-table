import styled from '@mui/system/styled';
import Box from '@mui/material/Box';
import { stardust } from '@nebula.js/stardust';
import React from 'react';
import { ChangeSortOrder, Column, ExtendedTranslator, SortDirection, TableLayout } from '../../../types';
import { GeneratedStyling } from '../../types';
import HeadCellMenu from '../head/HeadCellMenu';

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
  };
}

const StyledHeaderCellContainer = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'borderColor' && prop !== 'borderWidth',
})(({ borderColor, borderWidth }) => ({
  display: 'flex',
  flexDirection: 'row',
  borderColor,
  borderStyle: 'solid',
  borderWidth,
  padding: '0px 14px',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxSizing: 'border-box',
  '&&:hover, &&:focus': {
    '& button, & svg': { opacity: 1 },
  },
}));

const HeaderCell = ({ index, style, data }: HeaderCellProps) => {
  const { columns, headerStyle, embed, layout, translator, changeSortOrder } = data;
  const column = columns[index];
  const isLastColumn = columns.length - 1 === index;
  const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;

  const sortFromMenu = (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    changeSortOrder(column, newSortDirection);
  };

  return (
    <StyledHeaderCellContainer
      style={style}
      borderColor={headerStyle.borderColor}
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
        <span
          className="sn-table-cell-text"
          style={{
            fontSize: headerStyle.fontSize,
            fontFamily: headerStyle.fontFamily,
            fontWeight: 'bold',
            color: headerStyle.color,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {column.label}
        </span>
      </div>
      <HeadCellMenu
        headerStyle={headerStyle}
        translator={translator}
        sortFromMenu={sortFromMenu}
        embed={embed}
        layout={layout}
        columnIndex={column.colIdx}
        sortDirection={column.sortDirection}
        isInteractionEnabled
        isCurrentColumnActive={isCurrentColumnActive}
        isDimension={column.isDim}
        disablePortal={false}
      />
    </StyledHeaderCellContainer>
  );
};

export default HeaderCell;
