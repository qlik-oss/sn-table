import React, { useRef, useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { TableLayout } from '../../../types';

export interface ListBoxWrapperRenderProps {
  ref: React.RefObject<HTMLDivElement>;
}

interface ListBoxWrapperProps {
  children: (props: ListBoxWrapperRenderProps) => JSX.Element;
  layout: TableLayout;
  embed: stardust.Embed;
  columnIndex: number;
  closeListboxDropdown: () => void;
}

const getFieldId = (layout: TableLayout, columnIndex: number): string | stardust.LibraryField | undefined =>
  layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId
    ? {
        type: 'dimension',
        qLibraryId: layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId,
      }
    : layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle;

export const ListBoxWrapper = ({ children, embed, layout, columnIndex, closeListboxDropdown }: ListBoxWrapperProps) => {
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const ref = useRef<HTMLDivElement>(null);

  // embedding
  useEffect(() => {
    if (!layout || !embed) return;

    const fieldId = getFieldId(layout, columnIndex);

    if (fieldId === undefined) {
      return;
    }

    embed.field(fieldId).then((instance) => {
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
      popover: true,
    });

    listboxInstance.on('closePopover', closeListboxDropdown);

    return () => {
      listboxInstance.unmount();
    };
  }, [ref.current, listboxInstance]);

  return children({ ref });
};
