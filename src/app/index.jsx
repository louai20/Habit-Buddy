import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from '../store/store';
//import { Habits } from '../components/Habits';
import  AuthPresenter  from "../presenters/authPresenter";
import { PersistGate } from 'redux-persist/integration/react';
  
export default function IndexPage() { 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthPresenter />
      </PersistGate>
    </Provider>
  );
}

