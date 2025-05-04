import { combineReducers } from 'redux';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AppReducer from './AppReducer';
import UserReducer from './UserReducer';

// Redux persist configiration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['App', 'User', 'Issues'],
};

const rootReducer = combineReducers({
  App: AppReducer,
  User: UserReducer,
});

export default persistReducer(persistConfig, rootReducer);
