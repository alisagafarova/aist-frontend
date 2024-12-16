import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredTask }) => {
  const isAuthenticated = useSelector((state) => state.terminal.auth.isAuthenticated);
  const { currentUser, currentLab, currentTask } = useSelector(
    (state) => state.terminal.currentContext,
  );
  const tasks = useSelector((state) => state.terminal.tasks || {});

  const location = useLocation();

  // Путь первой лабораторной
  const firstLabPath = '/interface-config/';

  // Проверяем выполнение требуемой задачи
  const isTaskCompleted = requiredTask ? tasks[requiredTask]?.isCompleted || false : true;

  // Если не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если текущий путь - первая лабораторная, пропускаем проверку задач
  if (location.pathname === firstLabPath) {
    return children;
  }

  // Если задачи не загружены или требуемая задача не выполнена, перенаправляем
  if (!isTaskCompleted) {
    return <Navigate to={firstLabPath} />;
  }

  return children;
};

export default ProtectedRoute;
