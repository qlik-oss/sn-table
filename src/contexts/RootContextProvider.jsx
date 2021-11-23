import React from 'react';
import { RootContext } from './rootContext';
import { RootContextManager } from './RootContextManager';

export const RootContextProvider = ({ children, ...restProps }) => {
  const contextValue = RootContextManager(restProps);

  return <RootContext.Provider value={contextValue}>{children(contextValue)}</RootContext.Provider>;
};
