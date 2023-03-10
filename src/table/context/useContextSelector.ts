import { Context, useContext, useEffect, useState } from 'react';
import useMutableProp from '../virtualized-table/hooks/use-mutable-prop';
import { getSelectorContext, SelectorContextType } from './createSelectorProvider';

type Selector<TContext, TSelected> = (state: TContext) => TSelected;

export function useContextSelector<T, TSelected>(context: Context<T>, selector: Selector<T, TSelected>): TSelected {
  const accessorContext = getSelectorContext(context) as Context<SelectorContextType<T>>;
  const [accessor, listeners] = useContext(accessorContext);
  const currentValue = accessor();

  if (currentValue === undefined) {
    throw new Error('You must call useContextSelector inside a valid context.');
  }

  const [selectedState, setSelectedState] = useState(() => selector(currentValue));
  const latestSelector = useMutableProp(selector);
  const latestSelectedState = useMutableProp(selectedState);

  useEffect(() => {
    const listener = (nextValue: T) => {
      const newSelectedState = latestSelector.current && latestSelector.current(nextValue);

      if (newSelectedState !== latestSelectedState.current) {
        setSelectedState(newSelectedState);
      }
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, [latestSelectedState, latestSelector, listeners]);

  return selectedState;
}

export default useContextSelector;
