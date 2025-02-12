import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';

const localStore = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export default localStore;
export type RootState = ReturnType<typeof localStore.getState>;
export type AppDispatch = typeof localStore.dispatch;
