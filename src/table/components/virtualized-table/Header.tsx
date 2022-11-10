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
  }, [layout, pageInfo, forwardRef]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: headerStyle.backgroundColor,
        borderColor: headerStyle.borderColor,
        borderStyle: headerStyle.borderStyle,
        borderWidth: '1px 0px',
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
