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

export const StaticRouteConfig = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('static-route'));
    dispatch(setcurrentLab('lab2'));
    dispatch(setCurrentRouter('R1'));
  }, [dispatch]);
  const { currentUser, currentLab } = useSelector((state) => state.terminal.currentContext);

  const handleReset = () => {
    dispatch(resetTask({ currentUser, currentLab, taskId: 'static-route' }));
    alert('Задание сброшено. Конфигурация роутера обнулена.');
  };

  const handleHelp = () => {
    alert('Здесь будет подсказка.');
  };

  const labData = {
    title: 'Задание: Настройка статического маршрута',
    description:
      'Настройте статический маршрут на маршрутизаторе R1 до сети 192.168.1.0/24. Убедитесь, что маршрут появляется в таблице маршрутизации как static.',
    steps: [
      'Настройте статический маршрут с помощью команды ip route.',
      'Убедитесь, что маршрут отображается в таблице маршрутизации.',
    ],
    imagePath: '/images/static_route_config.png',
    imageAlt: 'Static Route Configuration',
    previousLink: '/static-route/',
    taskId: 'static-route',
    resetImage: resetImage,
    helpImage: helpImage,
    hints: [
      'Введите команду:\nconfigure terminal',
      'Введите:\nip route 192.168.1.0 255.255.255.0 10.2.2.2',
      'Проверьте статический маршрут командой:\nshow ip route',
    ],
  };

  return <TaskContainer labData={labData} onReset={handleReset} onHelp={handleHelp} />;
};
