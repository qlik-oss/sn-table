import React, { createContext, useCallback, useEffect, useMemo, useRef } from 'react';

const contextMap = new Map();

export function createSelectorProvider(OriginalContext) {
  const SelectorContext = createContext([() => undefined, new Set()]);

  contextMap.set(OriginalContext, SelectorContext);

  // eslint-disable-next-line react/prop-types
  const Provider = ({ children, value }) => {
    const contextValueRef = useRef(value);

    const listeners = useRef(new Set());

    useEffect(() => {
      contextValueRef.current = value;

      listeners.current.forEach((listener) => {
        listener(value);
      });
    }, [value]);

    const getContextValue = useCallback(() => {
      return contextValueRef.current;
    }, [contextValueRef]);

    const contextValue = useMemo(() => [getContextValue, listeners.current], [contextValueRef]);

    return (
      <OriginalContext.Provider value={value}>
        <SelectorContext.Provider value={contextValue}>{children}</SelectorContext.Provider>
      </OriginalContext.Provider>
    );
  };

  return Provider;
}

export function getSelectorContext(context) {
  return contextMap.get(context);
}
