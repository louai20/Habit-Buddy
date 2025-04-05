// using react Navigator instead of expo router because 
// its  is a more mature, flexible, and powerful solution for large-scale, complex React Native applications.
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import AuthPresenter from '../presenters/authPresenter';
import TabsLayout from './tabs/navlayout';

export default function RootLayout() {
  return (
    <StrictMode> 
      {/*helps identify potential problems in the app (e.g., deprecated lifecycle methods).*/}
      <Provider store={store}>
          {/* AuthPresenter is always visible on top */}
          <AuthPresenter />
          {/* TabsLayout will render the correct screen based on route */}
          <TabsLayout />
      </Provider>
    </StrictMode>
  );
}
