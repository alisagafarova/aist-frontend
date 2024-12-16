import { configureStore } from '@reduxjs/toolkit';
import terminalReducer from './slices/slices';
import saveToLocalStorageMiddleware from './middleware/saveToLocalStorageMiddleware';
import autoSaveMiddleware from './middleware/autoSaveMiddleware';

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('terminalState', JSON.stringify(state));
  } catch (error) {
    console.error('Could not save state', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('terminalState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error('Could not load state', error);
    return undefined;
  }
};

const preloadedState = loadFromLocalStorage();

const store = configureStore({
  reducer: {
    terminal: terminalReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      saveToLocalStorageMiddleware, // Middleware для сохранения в localStorage
      autoSaveMiddleware, // Middleware для автосохранения прогресса
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
