/* eslint-disable import/prefer-default-export */
// import { useRef } from 'react';
// import { useAnnounce } from '../hooks';
import useAnnounce from '../hooks/useAnnounce';

/**
 * this is he manager(actually the Hub) for all aspects of the sn-table
 * this manager will cover:
 *  1. selection
 *  2. scroll ✅
 *  3. focus
 *  4. a11y
 *  5. pagination
 *  6. utils as well
 */

export const RootContextManager = ({ focusedCellCoord, ...props }) => {
  // refs
  // const tableSectionRef = useRef();

  // custom hooks
  // useScroll({ tableSectionRef, focusedCellCoord, ...props });
  const announce = useAnnounce(props);
  // const { a11y, a11yFunctions } = useA11y(...someArgs);
  // const { selected, selectionFunctions } = useSelection(...someArgs)
  // and other hooks goes here

  return {
    // refs: {
    //   tableSectionRef,
    // },
    nebulaProps: props,
    announce,
    // selection: {
    //   selected,
    //   selectionFunctions,
    //   ...selectionRelatedDatahere
    // },
    // a11y: {
    //   a11y,
    //   a11yFunctions,
    // }
  };
};
