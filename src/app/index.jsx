import { Text } from "react-native"// src/boostrapping also works
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Habits } from '../components/Habits';
  
// TODO pass reactive model down to presenters
export default function IndexPage() { 
    
    return <Provider store={store}>
        <Habits />
    </Provider>
}

