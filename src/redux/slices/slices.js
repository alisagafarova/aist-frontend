import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { saveLastVisitedPath } from '../actions/lastVisitedPathActions';

export const fetchUserData = createAsyncThunk('terminal/fetchUserData', async (token, thunkAPI) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Возвращаем данные пользователя
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load user data');
  }
});

const initialState = {
  notifications: null,
  tasks: {
    // Глобальные задания
    'interface-config': {
      description: 'Настройка интерфейса',
      requiredStrings: ['GigabitEthernet 0/0', '10.2.2.1 255.255.255.0', 'no shutdown'],
      isTaskCompleted: false,
    },
    'static-route': {
      description: 'Настройка статического маршрута',
      requiredStrings: ['192.168.1.0/24 [1/0] via 10.2.2.2'],
      isTaskCompleted: false,
    },
    'network-config': {
      description: 'Настройка статического маршрута',
      routers: {
        R1: {
          requiredStrings: [
            'GigabitEthernet 0/0',
            '10.2.2.1 255.255.255.0',
            'no shutdown',
            '192.168.1.0/24 [1/0] via 10.2.2.2',
          ],
        },
        R2: {
          requiredStrings: ['GigabitEthernet 0/1', '10.2.2.2 255.255.255.0', 'no shutdown'],
        },
      },
      isTaskCompleted: false,
    },
  },
  users: {
    user1: {
      labs: [
        {
          lab1: {
            routers: {
              R1: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  { name: 'GigabitEthernet 0/0', ip: '', status: 'shutdown' },
                  { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
                ],
                connectedRoutes: [],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
              R2: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  {
                    name: 'GigabitEthernet 0/1',
                    ip: '10.2.2.2 255.255.255.0',
                    status: 'no shutdown',
                  },
                  {
                    name: 'GigabitEthernet 1/0',
                    ip: '192.168.1.1 255.255.255.0',
                    status: 'no shutdown',
                  },
                ],
                connectedRoutes: [{ network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' }],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
            },
          },
          lab2: {
            routers: {
              R1: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  {
                    name: 'GigabitEthernet 0/0',
                    ip: '10.2.2.1 255.255.255.0',
                    status: 'no shutdown',
                  },
                  { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
                ],
                connectedRoutes: [
                  {
                    network: '10.2.2.0/24',
                    iface: 'GigabitEthernet 0/0',
                  },
                ],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
              R2: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  {
                    name: 'GigabitEthernet 0/1',
                    ip: '10.2.2.2 255.255.255.0',
                    status: 'no shutdown',
                  },
                  {
                    name: 'GigabitEthernet 1/0',
                    ip: '192.168.1.1 255.255.255.0',
                    status: 'no shutdown',
                  },
                ],
                connectedRoutes: [{ network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' }],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
            },
          },
          lab3: {
            routers: {
              R1: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  { name: 'GigabitEthernet 0/0', ip: '', status: 'shutdown' },
                  { name: 'FastEthernet 0/1', ip: '', status: 'shutdown' },
                ],
                connectedRoutes: [],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
              R2: {
                output: [],
                commandHistory: [],
                historyIndex: -1,
                routes: [],
                interfaces: [
                  { name: 'GigabitEthernet 0/1', ip: '', status: 'shutdown' },
                  {
                    name: 'GigabitEthernet 1/0',
                    ip: '192.168.1.1 255.255.255.0',
                    status: 'no shutdown',
                  },
                ],
                connectedRoutes: [{ network: '192.168.1.0/24', iface: 'GigabitEthernet 1/0' }],
                isGlobalConfigMode: false,
                isInterfaceConfigMode: false,
                currentInterface: null,
              },
            },
          },
        },
      ],
    },
  },
  currentContext: {
    currentUser: 'user1',
    currentLab: 'lab1',
    currentRouter: 'R1',
    currentTask: 'interface-config',
  },
  auth: {
    isAuthenticated: !!localStorage.getItem('token'), // Проверяем токен при загрузке
    token: localStorage.getItem('token') || null, // Сохраняем токен
  },
  lastVisitedPath: localStorage.getItem('lastVisitedPath') || '/',
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    // Авторизация
    login(state, action) {
      const { token, userData } = action.payload;

      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);

      // Обновляем состояние авторизации
      state.auth.isAuthenticated = true;
      state.auth.token = token;
      state.tasks = userData.tasks;
      // Преобразуем массив labs в объект
      const formattedLabs = {};
      userData.labs.forEach((lab) => {
        const { labId, routers } = lab;
        formattedLabs[labId] = { routers };
      });

      // Обновляем данные только для user1
      state.users.user1 = {
        labs: formattedLabs,
      };

      // Обновляем текущий контекст пользователя
      state.currentContext = {
        currentUser: 'user1', // Привязываем к user1
        currentLab: userData.currentContext?.currentLab || 'lab1',
        currentRouter: userData.currentContext?.currentRouter || 'R1',
        currentTask: userData.currentContext?.currentTask || 'interface-config',
      };

      // Обновляем уведомления
      state.notifications = userData.notifications || null;
      state.lastVisitedPath = userData.lastVisitedPath || 'intro';
    },

    logout(state) {
      localStorage.clear();
      localStorage.removeItem('token');
      state.auth.isAuthenticated = false;
      state.users = {};
      state.auth.token = null;
    },
    setAuthToken(state, action) {
      const token = action.payload;
      localStorage.setItem('token', token);
      state.auth.token = token;
    },
    setRouterOutput(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;

      state.users[currentUser].labs[currentLab].routers[currentRouter].output.push(
        action.payload.output,
      );
    },
    setRouterCommandHistory(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;

      const Router = state.users[currentUser].labs[currentLab].routers[currentRouter];
      Router.commandHistory = [action.payload, ...Router.commandHistory];
    },
    setRouterHistoryIndex(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      const Router = state.users[currentUser].labs[currentLab].routers[currentRouter];
      Router.historyIndex = action.payload;
    },
    setRouterRoutes(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].routes = action.payload;
    },
    addRoute(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].routes.push(action.payload);
    },
    removeRoute(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      const routeToRemove = action.payload.split(' ')[0];
      state.users[currentUser].labs[currentLab].routers[currentRouter].routes = state.users[
        currentUser
      ].labs[currentLab].routers[currentRouter].routes.filter(
        (route) => !route.startsWith(routeToRemove),
      );
    },
    setRouterInterfaces(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].interfaces = action.payload;
    },
    setRouterConnectedRoutes(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].connectedRoutes =
        action.payload;
    },
    setRouterGlobalConfigMode(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].isGlobalConfigMode =
        action.payload;
    },
    setRouterInterfaceConfigMode(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].isInterfaceConfigMode =
        action.payload;
    },
    setRouterCurrentInterface(state, action) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].currentInterface =
        action.payload;
    },
    switchRouter(state, action) {
      state.currentContext.currentRouter = action.payload;
    },
    setProgress(state, action) {
      const { currentUser, currentLab } = state.currentContext;
      state.users[currentUser].labs[currentLab].progress = action.payload;
    },
    clearRouterOutput(state) {
      const { currentUser, currentLab, currentRouter } = state.currentContext;
      state.users[currentUser].labs[currentLab].routers[currentRouter].output = [];
    },
    updateTaskStep(state, action) {
      const { taskId, isCompleted } = action.payload;

      // Проверяем существование задачи
      if (state.tasks?.[taskId]) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              isCompleted,
            },
          },
        };
      }

      return state;
    },

    resetTask(state, action) {
      const { currentUser, currentLab, taskId } = action.payload;

      // Получаем начальное состояние лаборатории из initialState
      const initialLabState = initialState.users[currentUser]?.labs.find(
        (lab) => lab[currentLab],
      )?.[currentLab];

      if (!initialLabState) {
        console.error(`Initial state for lab ${currentLab} not found.`);
        return;
      }

      // Проверяем наличие пользователя
      const user = state.users[currentUser];
      if (!user) {
        console.error(`User ${currentUser} not found.`);
        return;
      }

      // Проверяем наличие лаборатории
      const lab = user.labs[currentLab];
      const task = state.tasks[taskId];

      if (!lab) {
        console.error(`Lab ${currentLab} not found for user ${currentUser}.`);
        return;
      }

      // Проверяем наличие задачи
      if (!task) {
        console.error(`Task ${taskId} not found in lab ${currentLab}.`);
        return;
      }

      // Сбрасываем задачу
      task.isCompleted = false;

      // Сбрасываем состояние лаборатории до начального
      user.labs[currentLab] = JSON.parse(JSON.stringify(initialLabState));
    },

    setcurrentLab(state, action) {
      state.currentContext.currentLab = action.payload;
    },
    setCurrentUser(state, action) {
      state.currentContext.currentUser = action.payload;
    },
    setCurrentTask(state, action) {
      const { taskId } = action.payload;
      state.currentContext.currentTask = action.payload; // Устанавливаем новое задание
    },
    setCurrentRouter(state, action) {
      state.currentContext.currentRouter = action.payload;
    },
    setNotification(state, action) {
      state.notifications = action.payload;
    },
    clearNotification(state) {
      state.notifications = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveLastVisitedPath.fulfilled, (state, action) => {
        // Обновляем путь в состоянии, если запрос на сервер был успешным
        state.lastVisitedPath = action.payload;
      })
      .addCase(saveLastVisitedPath.rejected, (state, action) => {
        // Логируем ошибку, если отправка на сервер не удалась
        console.error(action.payload);
      });
  },
});

export const {
  setNotification,
  clearNotification,
  setRouterOutput,
  setRouterCommandHistory,
  setRouterHistoryIndex,
  setRouterRoutes,
  addRoute,
  removeRoute,
  setRouterInterfaces,
  setRouterConnectedRoutes,
  setRouterGlobalConfigMode,
  setRouterInterfaceConfigMode,
  setRouterCurrentInterface,
  switchRouter,
  setProgress,
  clearRouterOutput,
  updateTaskStep,
  resetTask,
  setcurrentLab,
  setCurrentUser,
  setCurrentTask,
  setCurrentRouter,
  login,
  logout,
  setAuthToken,
} = terminalSlice.actions;

export default terminalSlice.reducer;
