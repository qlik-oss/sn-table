import React, { useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../types';

type UseListBoxProps = {
  elRef: React.MutableRefObject<HTMLElement | undefined>;
  layout: TableLayout;
  embed: stardust.Embed | undefined;
  columnIndex: number;
  open: boolean;
};

export default function useListboxFilter({ elRef, layout, embed, columnIndex, open }: UseListBoxProps) {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!layout || !embed) return;

    console.log('#outer');
    console.log({ layout, ref: elRef.current, embed, columnIndex });

    embed.field(layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle).then((instance) => {
      // setListboxInstance(instance);
      if (elRef.current && elRef.current.children.length === 0) {
        console.log({ kidCount: elRef?.current.children.length });
        instance.mount(elRef.current);
        setIsMounted(true);
      }
    });
  }, [layout, embed, columnIndex, open]);

  // useEffect(() => {
  //   if (!elRef.current || !listboxInstance || !layout?.qHyperCube?.qDimensionInfo) return undefined;

  //   console.log({ isMounted });

  //   if (elRef.current.children.length <= 0) {
  //     listboxInstance.mount(elRef.current);
  //     setIsMounted(true);
  //   }

  //   return () => {
  //     console.log('unmount');
  //     listboxInstance.unmount();
  //   };
  // }, [elRef.current, listboxInstance, open, isMounted]);

  return { isMounted, listboxInstance };
}
