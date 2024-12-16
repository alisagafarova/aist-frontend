import React, { useEffect } from 'react';
import styles from './NetworkBasicSetup.module.scss';
import { ProgressBar } from '../../../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setCurrentTask } from '../../../redux/slices/slices';

export const NetworkBasicSetup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('network-config'));
  }, []);

  const navigateToTask = () => {
    window.location.href = '/network-config/task3/';
  };

  const navigateBack = () => {
    window.location.href = '/static-route/task2/';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />
      <div className={styles.pageContainer}>
        <main className={styles.content}>
          <div className={styles.config_guide}>
            <h2>Комбинированная настройка сети</h2>
            <p>
              В третьем блоке мы будем комбинировать то, в чем разобрались в предыдущих двух уроках.
              Мы настроим интерфейсы на роутерах для генерации прямых маршрутов, донастроим
              статические маршруты для достижения связности между сетями. И наконец воспользуемся
              самой востребованной сетевой утилитой современности — <code>ping</code>!
            </p>

            <h3>Что такое ping?</h3>
            <p>
              Это утилита, которая реализована повсеместно — на каждом сетевом устройстве и во
              многих программах. Она создает ICMP-запрос: пакет, который имеет конкретный IP-адрес
              назначения и отправляется согласно маршрутной информации на устройстве. Если пакет
              уходит на другой роутер (или пингует само себя), он также проверяет свою таблицу
              маршрутизации. Процесс продолжается до достижения целевого адреса.
            </p>
            <p>
              Однако успех пинга — это не только достижение целевого адреса. Целевой адрес должен
              отправить ICMP-ответ, который вернется к источнику пинга. Успехом считается
              прохождение обоих пакетов — прямого и обратного.
            </p>

            <h3>Итак, план действий:</h3>
            <ul>
              <li>Настроить интерфейсы на обоих маршрутизаторах.</li>
              <li>Задать IP-адреса и активировать интерфейсы.</li>
              <li>
                Настроить статический маршрут на <code>R1</code> для подключения к удалённой сети.
              </li>
              <li>
                Проверить работоспособность сети с помощью команды <code>ping</code>.
              </li>
            </ul>

            <h3>Настройка интерфейсов:</h3>
            <pre>
              Router# configure terminal{'\n'}
              Router(config)# interface GigabitEthernet 0/0{'\n'}
              Router(config-if)# ip address 192.168.1.1 255.255.255.0{'\n'}
              Router(config-if)# no shutdown{'\n'}
              Router(config-if)# exit{'\n'}
              Router(config)# exit
            </pre>

            <h3>Настройка статического маршрута на R1:</h3>
            <pre>
              Router&gt; enable{'\n'}
              Router# configure terminal{'\n'}
              Router(config)# ip route 192.168.2.0 255.255.255.0 10.1.1.2{'\n'}
              Router(config)# exit
            </pre>

            <h3>Проверка таблицы маршрутизации:</h3>
            <pre>Router# show ip route</pre>

            <h3>Проверка соединения:</h3>
            <pre>Router# ping 192.168.2.1</pre>

            <h3>Пример успешного результата команды ping:</h3>
            <pre>
              Router# ping 192.168.2.1{'\n'}
              Sending 5, 100-byte ICMP Echos to 192.168.2.1, timeout is 2 seconds:{'\n'}
              !!!!!{'\n'}
              Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms
            </pre>
          </div>

          <div className={styles.buttons_bar}>
            <button className={styles.taskButton} onClick={() => navigateBack()}>
              Вернуться назад
            </button>
            <button className={styles.taskButton} onClick={() => navigateToTask()}>
              Перейти к заданию
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

// Функция для навигации к заданию
const navigateToTask = () => {
  window.location.href = '/network-config/task3/';
};

const navigateBack = () => {
  window.location.href = '/static-route/task2/';
};
