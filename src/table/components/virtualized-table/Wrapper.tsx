import React, { useLayoutEffect, useRef } from 'react';
import { VariableSizeGrid } from 'react-window';
import { RenderProps } from '../../types';
import Body from './Body';
import FullSizeContainer from './FullSizeContainer';
import Header from './Header';

export default function Wrapper(props: RenderProps) {
  const { layout, rect } = props;
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<VariableSizeGrid>(null);
  const bodyRef = useRef<VariableSizeGrid>(null);

  const onScrollHandler = (event: React.SyntheticEvent) => {
    if (headerRef.current) {
      headerRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }

    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }
  };

  useLayoutEffect(() => {
    if (layout && ref.current) {
      ref.current.scrollLeft = 0;
      ref.current.scrollTop = 0;
    }
  }, [layout]);

  return (
    <div
      ref={ref}
      style={{
        overflow: 'auto',
        width: rect.width,
        height: rect.height,
        border: '1px solid #ccc',
      }}
      onScroll={onScrollHandler}
    >
      <FullSizeContainer width={layout.qHyperCube.qSize.qcx * 125} height={layout.qHyperCube.qSize.qcy * 32}>
        <Header {...props} forwardRef={headerRef} />
        <Body {...props} forwardRef={bodyRef} />
      </FullSizeContainer>
    </div>
  );
}
