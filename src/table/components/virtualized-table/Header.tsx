import React, { useLayoutEffect, memo } from 'react';
import { VariableSizeList } from 'react-window';
import { HeaderProps } from './types';
import { HEADER_HEIGHT } from './constants';
import HeaderCell from './HeaderCell';

const Header = (props: HeaderProps) => {
  const { layout, rect, forwardRef, columns, columnWidth, pageInfo, headerStyle } = props;

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
    forwardRef?.current?.scrollTo(0);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'hidden',
        borderBottom: `1px solid ${headerStyle.borderBottomColor}`,
        backgroundColor: headerStyle.backgroundColor,
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      width={rect.width}
      itemData={{ columns, headerStyle }}
    >
      {HeaderCell}
    </VariableSizeList>
  );
};

export default memo(Header);
