/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { RootContext } from './RootContext';
import { RootContextManager } from './RootContextManager';

export const RootContextProvider = ({ children, ...restProps }) => {
  const contextValue = RootContextManager(restProps);

  return <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>;
};

// export default RootContextProvider;
