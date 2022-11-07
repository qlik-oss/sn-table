import React, { useLayoutEffect, memo } from 'react';
import { VariableSizeGrid } from 'react-window';
import { HeaderProps } from './types';
import { DEFAULT_ROW_HEIGHT, HEADER_HEIGHT } from './constants';
import HeaderCell from './HeaderCell';

const Header = (props: HeaderProps) => {
  const { layout, rect, forwardRef, columns, columnWidth, pageInfo, headerStyle } = props;

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    forwardRef?.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, [layout, pageInfo, forwardRef]);

  return (
    <VariableSizeGrid
      ref={forwardRef}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: headerStyle.backgroundColor,
        borderColor: headerStyle.borderColor,
        borderStyle: headerStyle.borderStyle,
        borderWidth: `1px 0px`,
      }}
      columnCount={layout.qHyperCube.qSize.qcx}
      columnWidth={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      rowCount={1}
      rowHeight={() => DEFAULT_ROW_HEIGHT}
      width={rect.width}
      itemData={{ columns, headerStyle }}
    >
      {HeaderCell}
    </VariableSizeGrid>
  );
};

export default memo(Header);
