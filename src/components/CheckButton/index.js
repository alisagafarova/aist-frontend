import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './CheckButton.module.scss';
import { checkTask } from '../../utils/checkTask'; // Импортируем функцию проверки

const CheckButton = ({ taskId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, currentLab, currentTask } = useSelector(
    (state) => state.terminal.currentContext,
  );
  const isTaskCompleted = useSelector((state) => state.terminal.tasks[currentTask]?.isCompleted);

  const taskNavigationMap = {
    'interface-config': '/static-route/',
    'static-route': '/network-config/',
    'network-config': '/finish/',
  };

  const handleCheck = () => {
    dispatch(checkTask(taskId, currentUser, currentLab));
  };

  const handleNext = () => {
    const nextUrl = taskNavigationMap[taskId];
    if (nextUrl) {
      navigate(nextUrl);
    } else {
      console.error(`No URL mapping found for taskId: ${taskId}`);
    }
  };
  return (
    <button
      className={`${styles.checkButton} ${isTaskCompleted ? styles.success : ''}`}
      onClick={isTaskCompleted ? handleNext : handleCheck}>
      {isTaskCompleted ? 'Погнали дальше' : 'Проверить'}
    </button>
  );
};

export default CheckButton;
