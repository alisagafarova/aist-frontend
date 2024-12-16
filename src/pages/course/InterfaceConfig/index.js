import React, { useEffect } from 'react';
import styles from './InterfaceConfig.module.scss';
import { ProgressBar } from '../../../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setCurrentTask, setcurrentLab, setCurrentRouter } from '../../../redux/slices/slices';

export const InterfaceConfiguration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('interface-config'));
    dispatch(setcurrentLab('lab1'));
    dispatch(setCurrentRouter('R1'));
  }, [dispatch]);

  const navigateBack = () => {
    window.location.href = '/intro/';
  };

  const navigateToTask = () => {
    window.location.href = '/interface-config/task1/';
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
            <h2>Конфигурация интерфейса</h2>
            <p>
              Итак, суть первого задания в демо — настройка интерфейсов на роутерах. Для этого мы
              временно закроем глаза на сложность управления сетью и представим, что все роутеры уже
              физически подключены, а волшебная сетевая фея предоставляет нам доступ к любому
              роутеру в сети.
            </p>
            <p>Тогда для настройки интерфейса нужно:</p>
            <ol>
              <li>
                <b>Использовать магию для подключения:</b> в реальной жизни для этого применяются
                такие протоколы, как SSH или Telnet.
              </li>
              <li>
                <b>Войти в режим конфигурации роутера:</b> <pre>Router# configure terminal</pre>
              </li>
              <li>
                <b>Перейти на уровень интересующего интерфейса:</b>{' '}
                <pre>Router(config)# interface GigabitEthernet 0/0</pre>
              </li>
              <li>
                <b>Назначить IP-адрес:</b>{' '}
                <pre>Router(config-if)# ip address 192.168.1.1 255.255.255.0</pre>
              </li>
              <li>
                <b>Активировать интерфейс:</b> <pre>Router(config-if)# no shutdown</pre>
              </li>
              <li>
                <b>Проверить настройки:</b> <pre>Router# show ip interface brief</pre>
              </li>
            </ol>
            <p>
              Круто! Длинное «Зачем?» превращается в 2–3 команды, которые нужно ввести на роутере, и
              всё заработает. Это ощущение мы хотим передать: на самом деле всё, что делают сетевые
              инженеры, сводится к вводу нескольких команд, чтобы роутеры выполняли нужные действия.
            </p>
            <p>
              Другая правда в том, что базовая конфигурация может быть простой, но стоящие за ней
              сетевые решения бывают куда сложнее. Однако на данном этапе мы сосредоточимся на
              основах.
            </p>

            <h3>Маршрутизация</h3>
            <p>
              Итак, роутеры соединены друг с другом, а интерфейсы настроены с IP-адресами. Как же
              дойти из точки A в точку B? Для этого каждый роутер должен знать, какие сети находятся
              рядом и через какие устройства к ним можно попасть. Эта информация называется
              маршрутом.
            </p>
            <p>
              Самый важный тип маршрутов на начальном этапе — это *непосредственно подключённые
              сети* (*directly connected*). Такие маршруты говорят роутеру, что он знает о сети,
              потому что она подключена напрямую к одному из его интерфейсов.
            </p>
            <p>
              Например, из конфигурации выше роутер узнаёт о сети 192.168.1.0/24, потому что она
              подключена через интерфейс GigabitEthernet 0/0.
            </p>

            <h3>Пример настройки интерфейса</h3>
            <pre>
              Router&gt; enable{'\n'}
              Router# configure terminal{'\n'}
              Router(config)# interface GigabitEthernet 0/0{'\n'}
              Router(config-if)# ip address 192.168.1.1 255.255.255.0{'\n'}
              Router(config-if)# no shutdown{'\n'}
              Router(config-if)# exit{'\n'}
              Router(config)# exit{'\n'}
              Router# show ip interface brief
            </pre>
          </div>
          <div className={styles.buttons_bar}>
            <button className={styles.taskButton} onClick={() => navigateBack()}>
              Введение
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
