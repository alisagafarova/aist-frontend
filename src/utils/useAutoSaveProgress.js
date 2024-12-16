import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveProgress } from './saveProgress'; // Импорт вашего saveProgress

export const useAutoSaveProgress = (currentLab, routerState, terminalState) => {
  const dispatch = useDispatch();

  const progressData = {
    labId: currentLab,
    progressData: {
      routers: routerState, // Состояние маршрутизаторов
      tasks: terminalState.tasks || {}, // Состояние задач
    },
  };

  // Ссылка на интервал для очистки
  const intervalRef = useRef(null);

  useEffect(() => {
    // Функция для сохранения прогресса
    const saveProgressToBackend = async () => {
      if (currentLab && progressData) {
        await saveProgress(progressData);
        console.log('Progress auto-saved!');
      }
    };

    // Устанавливаем интервал для автосохранения
    intervalRef.current = setInterval(saveProgressToBackend, 5 * 60 * 1000); // 5 минут

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalRef.current);
  }, [currentLab, progressData, dispatch]);

  return null; // Этот хук ничего не рендерит
};
