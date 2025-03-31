import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/store';
//import { Habits } from '../components/Habits';
import  AuthPresenter  from "../presenters/authPresenter";

  
export default function IndexPage() { 
  return (
    <Provider store={store}>
      <AuthPresenter />
    </Provider>
  );
}

