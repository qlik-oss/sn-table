import { useLayoutEffect, useState } from 'react';
import { useContextSelector, TableContext } from '../../context';

const useScrollbarWidth = (ref: React.RefObject<HTMLDivElement>) => {
  const { layout, rect, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const themeName = theme.name();
  const [xScrollbarWidth, setXScrollbarWidth] = useState(0);
  const [yScrollbarWidth, setYScrollbarWidth] = useState(0);

  /**
   * Scenarios that could change the container size OR the width column/s
   * has the potential to make a scrollbar appear.
   * - Theme change (Ex: font size)
   * - Layout change (Ex: column width property or fields added/removed)
   * - Container element is re-sized
   *
   * A column that is actively re-sized by the user can also cause a
   * scrollbar to appear. But that would trigger a state update while
   * the user is re-sizing, which causes a column size to "jump" in
   * a some what unpredictable maner. So we simply ignore that and
   * let the layout update when the user is done, catch the new column size.
   */
  useLayoutEffect(() => {
    if (ref.current) {
      const { offsetWidth = 0, offsetHeight = 0, clientWidth = 0, clientHeight = 0 } = ref.current ?? {};
      const widthDiff = offsetWidth - clientWidth;
      const heightDiff = offsetHeight - clientHeight;
      setYScrollbarWidth(widthDiff);
      setXScrollbarWidth(heightDiff);
    }
  }, [ref, layout, rect, themeName]);

  return { xScrollbarWidth, yScrollbarWidth };
};

export default useScrollbarWidth;
