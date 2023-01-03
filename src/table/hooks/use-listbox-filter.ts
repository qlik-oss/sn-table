import React, { useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../types';

interface UseListBoxProps {
  elRef: React.MutableRefObject<HTMLElement | undefined>;
  layout: TableLayout;
  embed: stardust.Embed | undefined;
  columnIndex: number;
  openPrimaryDropdown: boolean;
}

export default function useListboxFilter({ elRef, layout, embed, columnIndex, openPrimaryDropdown }: UseListBoxProps) {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const [isMounted, setIsMounted] = useState(false);

  // embedding
  useEffect(() => {
    if (!layout || !embed) return;

    embed.field(layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle).then((instance) => {
      setListboxInstance(instance);
    });
  }, [layout, embed, columnIndex]);

  // mounting
  useEffect(() => {
    if (openPrimaryDropdown) {
      listboxInstance?.unmount();
      setIsMounted(false);
      return;
    }

    if (!elRef.current || !listboxInstance) return;

    if (!isMounted) {
      listboxInstance.mount(elRef.current, { title: ' ' });
      setIsMounted(true);
    }
  }, [isMounted, listboxInstance, openPrimaryDropdown, setIsMounted]);

  return { listboxInstance };
}
