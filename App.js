import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStore,combineReducers,applyMiddleware} from 'redux' ;
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import NavigationContainer from './navigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import groupsReducer from './store/reducers/groups';
import groupReducer from './store/reducers/group';
import expensesReducer from './store/reducers/expenses';
import paymentsReducer from './store/reducers/payments';
const rootReducer = combineReducers({
  auth: authReducer,
  groups:groupsReducer,
  group:groupReducer,
  expenses:expensesReducer,
  payments:paymentsReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
