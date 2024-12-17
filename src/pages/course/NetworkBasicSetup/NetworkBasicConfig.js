import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskContainer from '../../../components/TaskContainer';
import { resetTask, setcurrentLab } from '../../../redux/slices/slices';
import resetImage from '../../../images/redo.png';
import helpImage from '../../../images/problem-solving.png';

export const NetworkBasicConfig = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('network-config'));
    dispatch(setcurrentLab('lab3'));
  }, [dispatch]);

  const { currentUser, currentLab } = useSelector((state) => state.terminal.currentContext);

  const handleReset = () => {
    dispatch(resetTask({ currentUser, currentLab, taskId: 'network-config' }));
    alert('Задание сброшено. Конфигурация роутера обнулена.');
  };

  const handleHelp = () => {
    alert('Здесь будет подсказка');
  };

  const labData = {
    title: 'Задание: Базовая настройка сети',
    description:
      'В этом задании вы научитесь выполнять базовую настройку сети, включая настройку интерфейсов и статических маршрутов на маршрутизаторах.',
    steps: [
      'Настройте интерфейс GigabitEthernet 0/0 с IP-адресом 192.168.1.1/24.',
      'Включите интерфейс с помощью команды no shutdown.',
      'Настройте статический маршрут до сети 192.168.2.0/24.',
      'Проверьте доступность сети 192.168.2.0/24, запустив команду ping.',
    ],
    imagePath: '/images/network_basic_config.png',
    imageAlt: 'Network Basic Configuration',
    previousLink: '/network-config/',
    taskId: 'network-config',
    resetImage: resetImage,
    helpImage: helpImage,
  };

  return <TaskContainer labData={labData} onReset={handleReset} onHelp={handleHelp} />;
};
