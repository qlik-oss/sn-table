import React from 'react';
import { PAGINATION_HEIGHT } from './constants';

interface FullSizeContainerProps {
  width: number;
  height: number;
  children: JSX.Element[] | JSX.Element;
  paginationNeeded: boolean;
}

const FullSizeContainer = ({ width, height, paginationNeeded, children }: FullSizeContainerProps): JSX.Element => {
  console.log('RENDERING FULL CONTAINER');
  return (
    <div
      data-key="full-size-container"
      style={{
        display: 'block',
        width,
        height: height + (paginationNeeded ? PAGINATION_HEIGHT : 0),
      }}
    >
      {children}
    </div>
  );
};

export default FullSizeContainer;
