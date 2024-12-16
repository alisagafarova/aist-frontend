import React, { useState } from 'react';
import styles from './ProgressBar.module.scss';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const progressData = [
  {
    path: '/interface-config/',
    label: '1. Конфигурация интерфейса',
    progress: '33%',
  },
  {
    path: '/static-route/',
    label: '2. Настройка статического маршрута',
    progress: '66%',
  },
  {
    path: '/network-config/',
    label: '3. Основы сетей',
    progress: '99%',
  },
];

export const ProgressBar = () => {
  const location = useLocation(); // Получаем текущий путь
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { currentUser, currentLab } = useSelector((state) => state.terminal.currentContext);
  const tasks = useSelector((state) => state.terminal.tasks || {});
  const currentProgress = progressData.find((item) => item.path === location.pathname) || {
    label: 'Прогресс неизвестен',
    progress: '0%',
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const isTaskAccessible = (taskId) => {
    if (taskId === 'interface-config') return true;

    // Проверяем, выполнено ли предыдущее задание
    const taskIndex = progressData.findIndex((item) => item.path.includes(taskId));
    console.log('taskIndex', taskIndex);
    const prevTask = progressData[taskIndex - 1];
    return tasks[prevTask?.path.split('/')[1]]?.isCompleted;
  };

  return (
    <div className={styles.pageContainer}>
      {!isSidebarVisible && (
        <button onClick={toggleSidebar} className={styles.menuButton}>
          <span className={styles.menuIcon}>☰</span>
        </button>
      )}
      <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ''}`}>
        <button onClick={toggleSidebar} className={styles.closeButton}>
          ✕
        </button>
        <nav className={styles.navigation}>
          <h3>Навигация</h3>
          <ul>
            {progressData.map((item, index) => {
              const taskId = item.path.split('/')[1]; // Извлекаем taskId из пути
              const isAccessible = isTaskAccessible(taskId);

              return (
                <li key={index} className={!isAccessible ? styles.disabled : ''}>
                  {isAccessible ? (
                    <a
                      href={item.path}
                      className={location.pathname === item.path ? styles.active : ''}>
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
