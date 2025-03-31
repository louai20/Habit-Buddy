import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from '../store/store';
import  AuthPresenter  from "../presenters/authPresenter";
import { PersistGate } from 'redux-persist/integration/react';
import HabitsPresenter from '../presenters/habitsPresenter';
  
export default function IndexPage() { 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthPresenter />
        <HabitsPresenter />
      </PersistGate>
    </Provider>
  );
}

