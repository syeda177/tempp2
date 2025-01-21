// app/ReduxProvider.tsx
'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Adjusted path if necessary

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;