import { saveProgress } from '../../utils/saveProgress';

const autoSaveMiddleware = (store) => (next) => async (action) => {
  // Передаем действие дальше
  const result = next(action);

  // Достаем текущее состояние
  const state = store.getState();

  // Проверяем, изменились ли текущие лабораторные данные
  const { currentUser, currentLab } = state.terminal.currentContext;

  const currentContext = state.terminal.currentContext;
  const routerState = state.terminal.users[currentUser]?.labs[currentLab]?.routers || {};
  const tasks = state.terminal.tasks || {};

  const actionType = action.type.split('/')[1];
  if (
    [
      'addRoute',
      'removeRoute',
      'setRouterInterfaces',
      'updateTaskStep',
      'resetTask',
      'isTaskCompleted',
      'setcurrentLab',
      'setcurrentTask',
    ].includes(actionType)
  ) {
    // Формируем данные для сохранения
    const progressData = {
      labId: currentLab,
      progressData: {
        routers: routerState,
      },
      tasks,
      currentContext,
    };

    // Запускаем сохранение прогресса
    try {
      const result = await saveProgress(progressData);

      if (result.success) {
      }
    } catch (error) {
      console.error('Error during auto-save:', error);
    }
  }

  return result;
};

export default autoSaveMiddleware;
