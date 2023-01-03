import React, { useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../types';

type UseListBoxProps = {
  elRef: React.MutableRefObject<HTMLElement | undefined>;
  layout: TableLayout;
  embed: stardust.Embed | undefined;
  columnIndex: number;
  openPrimaryDropdown: boolean;
  openSecondaryDropdown: boolean;
};

export default function useListboxFilter({
  elRef,
  layout,
  embed,
  columnIndex,
  openPrimaryDropdown,
  openSecondaryDropdown,
}: UseListBoxProps) {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const [isMounted, setIsMounted] = useState(false);

  // embedding
  useEffect(() => {
    if (!layout || !embed) return;

    embed.field(layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle).then((instance) => {
      setListboxInstance(instance);
    });
  }, [elRef.current, layout, embed, columnIndex]);

  // mounting
  useEffect(() => {
    // we need a way for setting isMounted to false
    // here we do it when we are in primary dropdown state
    if (openPrimaryDropdown) {
      setIsMounted(false);
      return;
    }

    // guard before mounting
    if (!elRef.current || !listboxInstance) return;

    // if not mounted, then mount it!
    if (!isMounted) {
      listboxInstance.mount(elRef.current, { title: ' ' });
      setIsMounted(true);
    }
  }, [elRef.current, isMounted, openSecondaryDropdown, openPrimaryDropdown]);

  return { listboxInstance };
}
