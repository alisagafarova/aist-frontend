import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskContainer from '../../../components/TaskContainer';
import {
  resetTask,
  setcurrentLab,
  setCurrentRouter,
  setCurrentTask,
} from '../../../redux/slices/slices';
import resetImage from '../../../images/redo.png';
import helpImage from '../../../images/problem-solving.png';

export const TaskInterfaceConfig = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('interface-config'));
    dispatch(setcurrentLab('lab1'));
    dispatch(setCurrentRouter('R1'));
  }, [dispatch]); // Зависимость для предотвращения лишних вызовов

  const { currentUser, currentLab } = useSelector((state) => state.terminal.currentContext);

  const handleReset = () => {
    dispatch(resetTask({ currentUser, currentLab, taskId: 'interface-config' }));
    alert('Задание сброшено. Конфигурация роутера обнулена.');
  };

  const handleHelp = () => {
    alert('Здесь будет подсказка.');
  };

  const labData = {
    title: 'Задание: Конфигурация интерфейса',
    description:
      'Настройте на маршрутизаторе R1 интерфейс GigabitEthernet 0/0 (Gi0/0) с IP-адресом и включите его. Проверьте статус интерфейса с помощью команды show ip interface brief и убедитесь, что маршрут появился в таблице маршрутизации как connected.',
    steps: [
      'Настройте IP-адрес на интерфейсе GigabitEthernet 0/0 (Gi0/0).',
      'Включите интерфейс с помощью команды no shutdown.',
      'Проверьте статус интерфейса командой show ip interface brief.',
      'Убедитесь, что сеть отображается в таблице маршрутизации как connected.',
    ],
    imagePath: '/images/int_confug_2.png',
    imageAlt: 'Interface Configuration',
    previousLink: '/interface-config/',
    taskId: 'interface-config',
    resetImage: resetImage,
    helpImage: helpImage,
  };

  return <TaskContainer labData={labData} onReset={handleReset} onHelp={handleHelp} />;
};
