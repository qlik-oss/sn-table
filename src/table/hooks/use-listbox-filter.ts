import React, { useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../types';

type UseListBoxProps = {
  elRef: React.MutableRefObject<HTMLElement | undefined>;
  layout: TableLayout;
  embed: stardust.Embed | undefined;
  columnIndex: number;
  openSecondaryDropdown: boolean;
};

export default function useListboxFilter({
  elRef,
  layout,
  embed,
  columnIndex,
  openSecondaryDropdown,
}: UseListBoxProps) {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!layout || !embed) return;

    if (!openSecondaryDropdown) {
      setIsMounted(false);
      return;
    }

    if (!isMounted) {
      embed.field(layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle).then((instance) => {
        setListboxInstance(instance);
        if (elRef.current) {
          instance.mount(elRef.current);
          setIsMounted(true);
        }
      });
    }
  }, [elRef.current, layout, embed, columnIndex, openSecondaryDropdown, isMounted]);

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
  // }, [elRef.current, listboxInstance, openPrimaryDropdown, isMounted]);

  return { listboxInstance };
}
