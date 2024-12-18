import React from 'react';
import TaskDescription from '../TaskDescription';
import TerminalConsole from '../TermialConsole';
import CheckButton from '..//CheckButton';
import { Link } from 'react-router-dom';
import styles from './TaskContainer.module.scss';

const TaskContainer = ({ labData, onReset, onHelp }) => {
  const { title, description, steps, imagePath, imageAlt, previousLink, taskId } = labData;
  console.log('imagePath', imagePath);
  return (
    <div className={styles.lab_block}>
      <div className={styles.lab_environment}>
        {/* Описание задания */}
        <TaskDescription
          title={title}
          description={description}
          steps={steps}
          imagePath={imagePath}
          imageAlt={imageAlt}
        />
        {/* Консоль */}
        <TerminalConsole />
      </div>

      {/* Панель управления */}
      <div className={styles.lab_buttons}>
        <div className={styles.left}>
          <Link to={previousLink}>
            <button className={styles.button_previous}>Вернуться к теме</button>
          </Link>
        </div>
        <div className={styles.right}>
          <button className={styles.resetButton} data-tooltip="Подсказка" onClick={onHelp}>
            <img src={labData.helpImage} className={styles.image_button} alt="Подсказка" />
          </button>
          <button
            className={styles.resetButton}
            data-tooltip="Сброс конфигурации"
            onClick={onReset}>
            <img src={labData.resetImage} className={styles.image_button} alt="Сброс" />
          </button>
          <CheckButton taskId={taskId} />
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;
