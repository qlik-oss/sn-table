import { createContext, useContext } from 'react';

export const RootContext = createContext();
export const useRootContext = () => useContext(RootContext);
