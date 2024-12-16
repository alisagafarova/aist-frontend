import React, { useEffect } from 'react';
import styles from './StaticRoute.module.scss';
import { ProgressBar } from '../../../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setCurrentTask, setcurrentLab, setCurrentRouter } from '../../../redux/slices/slices';

export const StaticRoute = () => {
  const dispatch = useDispatch();
  dispatch(setcurrentLab('lab2'));
  dispatch(setCurrentRouter('R1'));
  dispatch(setCurrentTask('static-route'));

  const navigateToTask = () => {
    window.location.href = '/static-route/task2/';
  };

  const navigateBack = () => {
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
            <h2>Настройка статического маршрута</h2>
            <p>
              Теперь всё работает, если необходимые сети подключены к роутеру напрямую. То есть,
              теперь берем один роутер, подключаем все сети мира к нему, и наш интернет готов.
            </p>
            <p>- «Но это же невозможно!» — скажете вы. - «Конечно, невозможно!» — отвечу я.</p>
            <p>
              Поэтому, чтобы всё работало глобально, нужны механизмы, позволяющие сообщать роутеру о
              сетях, которые к нему напрямую не подключены: сообщать, что они существуют и как до
              них добраться.
            </p>

            <h3>Статические маршруты</h3>
            <p>
              Как я написал выше, статические маршруты — это способ вручную донести до роутера
              информацию о том, куда идти. Этот способ лишён механизмов самостоятельного принятия
              решений роутером, что является минусом. Но в то же время, это может быть удобный
              инструмент даже в современных сложных сетевых дизайнах.
            </p>
            <p>
              В первую очередь статический маршрут включает:
              <ul>
                <li>
                  Сеть, про которую мы хотим сообщить роутеру, например, <code>192.168.2.0/24</code>
                  .
                </li>
                <li>
                  «Некст хоп» — адрес, через который нужно передать данные, чтобы попасть в нужную
                  сеть. Этот адрес должен быть достижимым, иначе маршрут не окажется в таблице
                  маршрутизации.
                </li>
              </ul>
            </p>

            <h3>Основные шаги по настройке статического маршрута</h3>
            <ol>
              <li>
                Переход в режим конфигурации:
                <pre>Router# configure terminal</pre>
              </li>
              <li>
                Добавление статического маршрута:
                <pre>
                  Router(config)# ip route &lt;destination&gt; &lt;mask&gt; &lt;next-hop&gt;
                </pre>
                Например:
                <pre>Router(config)# ip route 192.168.2.0 255.255.255.0 10.1.1.2</pre>
              </li>
              <li>
                Проверка таблицы маршрутизации:
                <pre>Router# show ip route</pre>
              </li>
            </ol>

            <h3>Как удалить статический маршрут</h3>
            <p>
              Если маршрут больше не нужен, его можно удалить с помощью команды:
              <pre>
                Router(config)# no ip route &lt;destination&gt; &lt;mask&gt; &lt;next-hop&gt;
              </pre>
            </p>
            <p>
              Например, для удаления маршрута к сети <code>192.168.2.0/24</code> через шлюз{' '}
              <code>10.1.1.2</code>, выполните:
              <pre>Router(config)# no ip route 192.168.2.0 255.255.255.0 10.1.1.2</pre>
            </p>

            <h3>Пример отображения статического маршрута в таблице маршрутизации</h3>
            <pre>
              Router# show ip route Codes: C - connected, S - static, ... S 192.168.2.0/24 [1/0] via
              10.1.1.2
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
