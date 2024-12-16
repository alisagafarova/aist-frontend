import React, { useEffect } from 'react';
import styles from './Introduction.module.scss';
import { ProgressBar } from '../../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setCurrentTask, setcurrentLab, setCurrentRouter } from '../../redux/slices/slices';

export const Introduction = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTask('introduction'));
  }, [dispatch]);

  const navigateToNextPage = () => {
    window.location.href = '/interface-config/';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.pageContainer}>
        <main className={styles.content}>
          <div className={styles.config_guide}>
            <h2>Введение</h2>
            <p>
              Привет, добро пожаловать в депо нашего будущего курса! Его идея — сделать сети
              простыми и понятными для кого угодно: сетевого инженера, программиста или
              биологического маркетолога :)
            </p>

            <h3>С чего начнем?</h3>
            <p>
              Большой и сложный интернет на самом деле — это просто много-много сетевых устройств,
              соединенных вместе и гоняющих сетевые пакеты туда-сюда. Все известные сервисы, такие
              как Google или Amazon, это просто сервера, которые где-то включены в глобальную сеть.
              Дальше дело за малым — просто добраться до этих серверов.
            </p>

            <p>
              Как я сказал выше, сеть — это просто много сетевых устройств, подключенных друг к
              другу. На этом этапе будем считать, что все «сетевые устройства» — это роутеры (для
              простоты). На самом деле сетевой мир немного сложнее (но только совсем чуть-чуть
              сложнее).
            </p>

            <h3>Как же роутеры подключаются и общаются друг с другом?</h3>
            <p>
              Для этого они используют свои порты или, как мы (сетевые инженеры) привыкли называть
              их на английский манер, — интерфейсы. Интерфейс — это как физическая, так и логическая
              сущность. Во-первых, это место, куда вставляются провода, чтобы физически объединить
              устройства. С другой стороны, это логическая сущность, которая должна обладать
              параметрами для будущего взаимодействия — режим работы, адрес и т.д.
            </p>
          </div>
          <button className={styles.taskButton} onClick={() => navigateToNextPage()}>
            Ближе к делу
          </button>
        </main>
      </div>
    </>
  );
};
