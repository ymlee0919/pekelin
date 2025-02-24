import { combineReducers, configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';
import currentProductReducer from './slices/productSlice';

const rootReducer = combineReducers({
  global: globalReducer,
  currentProduct: currentProductReducer,
});

const localStore = configureStore({
  reducer: rootReducer
});

export default localStore;
export type RootState = ReturnType<typeof localStore.getState>;
export type AppDispatch = typeof localStore.dispatch;
