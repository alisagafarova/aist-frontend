import React, { useState } from 'react';
import TaskDescription from '../TaskDescription';
import TerminalConsole from '../TermialConsole';
import CheckButton from '..//CheckButton';
import { Link } from 'react-router-dom';
import styles from './TaskContainer.module.scss';

const TaskContainer = ({ labData, onReset }) => {
  const { title, description, steps, imagePath, imageAlt, previousLink, taskId, hints } = labData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          <button className={styles.resetButton} data-tooltip="Подсказка" onClick={openModal}>
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
      {/* Модальное окно */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal} aria-label="Закрыть">
              &times;
            </button>
            <h3>Подсказки:</h3>
            <ul>
              {hints.map((hint, index) => (
                <li key={index}>
                  {hint.split('\n').map((line, i) =>
                    line.startsWith('interface') ||
                    line.startsWith('ip') ||
                    line.startsWith('no') ||
                    line.startsWith('show') ||
                    line.startsWith('configure') ||
                    line.startsWith('ping') ? (
                      <pre key={i} className={styles.commandStyle}>
                        {line}
                      </pre>
                    ) : (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ),
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskContainer;
