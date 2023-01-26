import { useRef } from 'react';

// Act as a wrapper for https://beta.reactjs.org/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
export default function useOnPropsChange<T>(callback: () => void, props: T[]) {
  const prev = useRef<T[]>(props);
  const hasChanged = prev.current.some((prevProp, index) => prevProp !== props[index]);

  if (hasChanged) {
    prev.current = props;
    callback();
  }
}
