import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Store from './src/store/Store';

const ReduxApp = () => (
    <Provider store={Store}>  
        <App />
    </Provider>  
)    

AppRegistry.registerComponent(appName, () => ReduxApp);
