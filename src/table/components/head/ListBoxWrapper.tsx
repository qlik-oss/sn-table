import React, { useRef, useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../../types';

export interface ListBoxWrapperRenderProps {
  ref: React.RefObject<HTMLElement>;
}

interface ListBoxWrapperProps {
  children: (props: ListBoxWrapperRenderProps) => JSX.Element;
  layout: TableLayout;
  embed: stardust.Embed;
  columnIndex: number;
  onSelectionConfirm: () => void;
  onSelectionCancel: () => void;
}

export const ListBoxWrapper = ({
  children,
  embed,
  layout,
  columnIndex,
  onSelectionConfirm,
  onSelectionCancel,
}: ListBoxWrapperProps) => {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const ref = useRef<HTMLElement>(null);

  // embedding
  useEffect(() => {
    if (!layout || !embed) return;

    embed.field(layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle).then((instance) => {
      setListboxInstance(instance);
    });
  }, []);

  // mounting
  useEffect(() => {
    if (!ref.current || !listboxInstance) return undefined;

    // passing title: ' ' (an empty space)
    // because of passing null or undefined will still endup showing title
    listboxInstance.mount(ref.current, {
      title: ' ',
      // @ts-ignore: should fix in nebula before merging this
      onSelectionConfirm,
      onSelectionCancel,
    });

    return () => {
      listboxInstance.unmount();
    };
  }, [ref.current, listboxInstance]);

  return children({ ref });
};
