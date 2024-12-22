import React, { useState } from 'react';
import styles from './ProgressBar.module.scss';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const progressData = [
  {
    paths: ['/interface-config/', '/interface-config/task1/'], // Массив путей
    label: '1. Конфигурация интерфейса',
    progress: '33%',
  },
  {
    paths: ['/static-route/', '/static-route/task2/'], // Массив путей
    label: '2. Настройка статического маршрута',
    progress: '66%',
  },
  {
    paths: ['/network-config/', '/network-config/task3/'], // Массив путей
    label: '3. Основы сетей',
    progress: '99%',
  },
];

export const ProgressBar = () => {
  const location = useLocation(); // Получаем текущий путь
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const tasks = useSelector((state) => state.terminal.tasks || {});

  // Найти текущий прогресс по текущему пути
  const currentProgress = progressData.find((item) => item.paths.includes(location.pathname)) || {
    label: 'Прогресс неизвестен',
    progress: '0%',
  };

  // Тоггл для боковой панели
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const isTaskAccessible = (taskPaths) => {
    // Если это первая задача, то она всегда доступна
    if (progressData[0].paths.some((path) => taskPaths.includes(path))) {
      return true;
    }

    // Найти индекс текущей задачи
    const taskIndex = progressData.findIndex((item) =>
      item.paths.some((path) => taskPaths.includes(path)),
    );

    // Проверить выполнение предыдущей задачи
    if (taskIndex > 0) {
      const prevTask = progressData[taskIndex - 1];
      return prevTask.paths.some((path) => tasks[path.split('/')[1]]?.isCompleted);
    }

    return false; // По умолчанию недоступно
  };
  return (
    <div className={styles.pageContainer}>
      {!isSidebarVisible && (
        <button onClick={toggleSidebar} className={styles.menuButton}>
          <span className={styles.menuIcon}>☰</span>
        </button>
      )}
      {/* Боковая панель */}
      <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ''}`}>
        <button onClick={toggleSidebar} className={styles.closeButton}>
          ✕
        </button>
        <nav className={styles.navigation}>
          <h3>Навигация</h3>
          <ul>
            {progressData.map((item, index) => {
              const isAccessible = isTaskAccessible(item.paths);

              return (
                <li key={index} className={!isAccessible ? styles.disabled : ''}>
                  {isAccessible ? (
                    <a
                      href={item.paths[0]}
                      className={item.paths.includes(location.pathname) ? styles.active : ''}>
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <div className={styles.progress}>
          <span className={styles.progressLabel}>Прогресс</span>
          <div className={styles.progressBar}>
            <div className={styles.progressCurrent} style={{ width: currentProgress.progress }} />
          </div>
          <p>{currentProgress.label}</p>
        </div>
      </main>
    </div>
  );
};
