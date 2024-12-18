import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TaskDescription.module.scss';
import IntConfigImg from '../../images/image_config.png';
import StaticRouteConfigImg from '../../images/ static_route_config.png';

const taskData = {
  '/interface-config/task1/': {
    title: 'Задание: Конфигурация интерфейса',
    imageAlt: 'Interface Configuration',
    description:
      'Настройте на маршрутизаторе R1 интерфейс GigabitEthernet 0/0 (Gi0/0) с IP-адресом и включите его. Проверьте статус интерфейса с помощью команды show ip interface brief и убедитесь, что маршрут появился в таблице маршрутизации как connected.',
    steps: [
      'Настройте IP-адрес на интерфейсе GigabitEthernet 0/0 (Gi0/0).',
      'Включите интерфейс с помощью команды no shutdown.',
      'Проверьте статус интерфейса командой show ip interface brief.',
      'Убедитесь, что сеть отображается в таблице маршрутизации как connected.',
    ],
    imagePath: IntConfigImg,
  },
  '/static-route/task2/': {
    title: 'Задание: Настройка статического маршрута',
    imageAlt: 'Static Route Configuration',
    description:
      'Настройте статический маршрут на маршрутизаторе R1 до сети 192.168.1.0/24. Убедитесь, что маршрут появляется в таблице маршрутизации как static.',
    steps: [
      'Настройте статический маршрут с помощью команды ip route.',
      'Убедитесь, что маршрут отображается в таблице маршрутизации.',
    ],
    imagePath: StaticRouteConfigImg,
  },
  '/network-config/task3/': {
    title: 'Задание: Настройка статического маршрута и взаимодействие между маршрутизаторами',
    imageAlt: 'Static Route and Ping Configuration',
    description:
      'В этом задании вы научитесь переключаться между маршрутизаторами и настраивать взаимодействие между ними. На маршрутизаторе R1 настройте интерфейс GigabitEthernet 0/0 с IP-адресом 10.2.2.1 и пропишите статический маршрут до сети 192.168.1.0/24. На маршрутизаторе R2 настройте интерфейс GigabitEthernet 0/1 с IP-адресом 10.2.2.2. Проверьте доступность сети 192.168.1.0/24, запустив команду ping с R1.',
    steps: [
      'Переключитесь на маршрутизатор R1.',
      'Настройте интерфейс GigabitEthernet 0/0 с IP-адресом 10.2.2.1.',
      'Пропишите статический маршрут до сети 192.168.1.0/24.',
      'Переключитесь на маршрутизатор R2.',
      'Настройте интерфейс GigabitEthernet 0/1 с IP-адресом 10.2.2.2.',
      'Вернитесь на маршрутизатор R1 и проверьте доступность сети 192.168.1.0/24, используя команду ping.',
    ],
    imagePath: StaticRouteConfigImg,
  },
};

const TaskDescription = () => {
  const location = useLocation();
  const task = taskData[location.pathname] || {};

  return (
    <div className={styles.taskContainer}>
      {task.imagePath && (
        <div className={styles.lab_image_container}>
          <img src={task.imagePath} className={styles.lab_image} alt={task.imageAlt || 'Task'} />
        </div>
      )}
      <div className={styles.taskContent}>
        <h2>{task.title || 'Задание не найдено'}</h2>
        <p>{task.description || 'Описание отсутствует.'}</p>
        {task.steps && (
          <ul>
            {task.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;
