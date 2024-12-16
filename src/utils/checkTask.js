import { updateTaskStep, setNotification } from '../redux/slices/slices';

export const checkTask = (taskId, currentUser, currentLab) => (dispatch, getState) => {
  const state = getState();
  const labTasks = state.terminal.tasks;
  const task = labTasks?.[taskId];

  if (taskId === 'interface-config') {
    const r1 = state.terminal.users[currentUser].labs[currentLab].routers.R1;

    const { requiredStrings } = task;

    if (!requiredStrings || requiredStrings.length < 3) {
      alert(`Ошибка: Требования к заданию с идентификатором ${taskId} определены некорректно`);
      return;
    }

    // Извлекаем требования из задачи
    const requiredInterface = requiredStrings[0];
    const requiredIp = requiredStrings[1];
    const requiredStatus = requiredStrings[2];

    // Ищем интерфейс
    const targetInterface = r1.interfaces.find((iface) => iface.name === requiredInterface);

    if (!targetInterface) {
      dispatch(
        setNotification({ type: 'error', message: `Интерфейс ${requiredInterface} не найден` }),
      );
      return;
    }

    // Проверяем IP и статус
    const isIpCorrect = targetInterface.ip === requiredIp;
    const isStatusCorrect = targetInterface.status === requiredStatus;

    if (isIpCorrect && isStatusCorrect) {
      dispatch(
        updateTaskStep({
          taskId,
          isCompleted: true,
        }),
      );
    } else {
      alert(`Задание не выполнено. Проверьте конфигурацию роутера и попробуйте снова.`);

      return;
    }
  } else if (taskId === 'static-route') {
    const { requiredStrings } = task;

    if (!requiredStrings || requiredStrings.length !== 1) {
      alert(`Ошибка: Требования для задания ${taskId} определены некорректно.`);
      return;
    }

    const requiredRoute = requiredStrings[0]; // Например: "ip route 192.168.1.0 255.255.255.0 192.168.2.1"

    // Проверяем наличие маршрута в конфигурации

    const routes = state.terminal.users[currentUser].labs?.[currentLab].routers.R1.routes;
    const isRoutePresent = routes.includes(requiredRoute);

    if (isRoutePresent) {
      dispatch(
        updateTaskStep({
          taskId,
          isCompleted: true,
        }),
      );
    } else {
      alert(`Задание не выполнено. Проверьте конфигурацию роутера и попробуйте снова.`);
    }
  } else if (taskId === 'network-config') {
    const r1 = state.terminal.users[currentUser].labs[currentLab].routers.R1;
    const r2 = state.terminal.users[currentUser].labs[currentLab].routers.R2;

    const r1Interface = r1.interfaces.find((iface) => iface.name === 'GigabitEthernet 0/0');
    const r1Route = r1.routes.includes('192.168.1.0/24 [1/0] via 10.2.2.2');
    const r2Interface1 = r2.interfaces.find((iface) => iface.name === 'GigabitEthernet 0/1');
    const r2Interface2 = r2.interfaces.find((iface) => iface.name === 'GigabitEthernet 1/0');

    const r1IsValid =
      r1Interface &&
      r1Interface.ip === '10.2.2.1 255.255.255.0' &&
      r1Interface.status === 'no shutdown' &&
      r1Route;

    const r2IsValid =
      r2Interface1 &&
      r2Interface1.ip === '10.2.2.2 255.255.255.0' &&
      r2Interface1.status === 'no shutdown' &&
      r2Interface2 &&
      r2Interface2.ip === '192.168.1.1 255.255.255.0' &&
      r2Interface2.status === 'no shutdown';

    if (r1IsValid && r2IsValid) {
      dispatch(
        updateTaskStep({
          taskId,
          isCompleted: true,
        }),
      );
    } else {
      alert(`Задание не выполнено. Проверьте настройки интерфейсов и маршрутов на R1 и R2`);
    }
  } else {
    alert(`Задание с идентификатором ${taskId} не имеет определенной логики проверки.`);
  }
};
