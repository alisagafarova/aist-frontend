const saveToLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Определяем действия, для которых нужно обновлять localStorage
  const actionsToPersist = ['login', 'logout', 'setRouterOutput', 'updateTaskStep'];

  if (actionsToPersist.includes(action.type)) {
    try {
      const state = store.getState();
      const terminalState = {
        auth: state.terminal.auth, // Сохраняем данные авторизации
        users: state.terminal.users, // Сохраняем прогресс
      };
      localStorage.setItem('terminalState', JSON.stringify(terminalState));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  return result;
};

export default saveToLocalStorageMiddleware;
