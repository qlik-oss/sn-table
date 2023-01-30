import React, { useRef, useState, useEffect } from 'react';
import { stardust } from '@nebula.js/stardust';
import { useContextSelector, TableContext } from '../../context';
import { TableLayout } from '../../../types';

export interface ListBoxWrapperRenderProps {
  ref: React.RefObject<HTMLElement>;
}

interface ListBoxWrapperProps {
  children: (props: ListBoxWrapperRenderProps) => JSX.Element;
  columnIndex: number;
}

const getFieldId = (layout: TableLayout, columnIndex: number): string | stardust.LibraryField | undefined =>
  layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId
    ? {
        type: 'dimension',
        qLibraryId: layout.qHyperCube.qDimensionInfo[columnIndex]?.qLibraryId,
      }
    : layout.qHyperCube.qDimensionInfo[columnIndex]?.qFallbackTitle;

export const ListBoxWrapper = ({ children, columnIndex }: ListBoxWrapperProps) => {
  const { embed, layout } = useContextSelector(TableContext, (value) => value.baseProps);
  const [listboxInstance, setListboxInstance] = useState<stardust.FieldInstance>();
  const ref = useRef<HTMLElement>(null);

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
    // because of passing null or undefined will still end up showing title
    listboxInstance.mount(ref.current, { title: ' ' });

    return () => {
      listboxInstance.unmount();
    };
  }, [ref.current, listboxInstance]);

  return children({ ref });
};
