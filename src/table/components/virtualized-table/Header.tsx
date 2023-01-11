import React, { useLayoutEffect, memo } from 'react';
import { VariableSizeList } from 'react-window';
import { HeaderProps } from './types';
import { HEADER_HEIGHT } from './constants';
import HeaderCell from './HeaderCell';

const Header = (props: HeaderProps) => {
  const { layout, rect, forwardRef, columns, columnWidth, pageInfo, headerStyle, embed, translator, changeSortOrder } =
    props;

  useLayoutEffect(() => {
    forwardRef?.current?.resetAfterIndex(0, true);
    forwardRef?.current?.scrollTo(0);
  }, [layout, pageInfo, forwardRef, columnWidth]);

  return (
    <VariableSizeList
      ref={forwardRef}
      layout="horizontal"
      style={{
        overflow: 'hidden',
        backgroundColor: headerStyle.backgroundColor,
        borderColor: headerStyle.borderColor,
        borderStyle: 'solid',
        borderWidth: '0px 0px 1px 0px',
        boxSizing: 'border-box',
      }}
      itemCount={layout.qHyperCube.qSize.qcx}
      itemSize={(index) => columnWidth[index]}
      height={HEADER_HEIGHT}
      width={rect.width}
      itemData={{ columns, headerStyle, layout, embed, translator, changeSortOrder }}
    >
      {HeaderCell}
    </VariableSizeList>
  );
};

export default memo(Header);
