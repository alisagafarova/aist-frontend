import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskContainer from '../../../components/TaskContainer';
import { resetTask, setcurrentLab, setCurrentTask } from '../../../redux/slices/slices';
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
    hints: [
      'На R1 войдите конфигурационный режим, в режим интерфейса Gi0/0 и пропишите статический маршрут: \ninterface Gi0/0\nip address 10.2.2.1 255.255.255.0\nno shutdown\nip route 192.168.1.0 255.255.255.0',
      'На R2 войдите конфигурационный режим, в режим интерфейса Gi0/1 и настройте интерфейс: \ninterface Gi0/1\nip address 10.2.2.2 255.255.255.0\nno shutdown',
      'Проверьте маршрут командой ping с R1: \nping 192.168.1.1',
    ],
  };

  return <TaskContainer labData={labData} onReset={handleReset} onHelp={handleHelp} />;
};
