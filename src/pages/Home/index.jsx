import React from 'react';
import styles from "./Home.module.scss";
import { Link, useLocation } from 'react-router-dom';
import image_page from '../../images/image_page.jpg'
import image_me from '../../images/me.png'
import { useSelector } from 'react-redux'; // Подключаем Redux
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const isAuthenticated = useSelector((state) => state.terminal.auth.isAuthenticated); // Получаем состояние авторизации
  const currentUser = useSelector((state) => state.terminal.currentContext.currentUser); // Получаем текущего пользователя
  const currentLab = useSelector((state) => state.terminal.currentContext.currentLab); // Получаем текущую лабораторию
  const currentTask = useSelector((state) => state.terminal.currentContext.currentTask); // Получаем текущую лабораторию
  
  const tasks = useSelector(
    (state) => state.terminal.users[currentUser]?.labs[currentLab]?.tasks || {},
  );
  const lastVisited = useSelector(
    (state) =>state.terminal.lastVisitedPath
  );

  const navigate = useNavigate();

  const handleStartLearning = async () => {
    if (!isAuthenticated) {
      navigate('/login/'); // Перенаправляем на страницу входа
    } else {
      const lastVisitedPath = lastVisited || '/intro/';
      navigate(lastVisitedPath); // Перенаправляем на сохраненную страницу
    }
  };
  

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <h1 className={styles.intro_title}>Изучайте сетевые технологии с нуля до профессионала</h1>
        <button className={styles.intro_button} onClick={handleStartLearning}> Начать учиться</button>
      </div>
      <div className={styles.network}>
        <img src={image_page} className={styles.network_image}/>
      </div>
      <div className={styles.about}>
        <img src={image_me} className={styles.image_me}/>
        <div className={styles.about_text}>
          <p> Всем привет!</p>
          <p>Меня зовут Сергей Овинцовский, и это бета-версия сайта про сетевые технологии.</p>
          <p>Идея сайта — создать уникальную платформу для изучения сетей, где вас ждут:</p>
            <li> Краткие и понятные теоретические материалы</li>
            <li>Интересные видеоуроки</li>
            <li>И, что самое главное, практические задания на эмулированной консоли</li>
          <p> Прошу вас протестировать сайт и поделиться своими впечатлениями. Буду рад вашим пожеланиям и словам благодарности!</p> 
        </div>
      </div>
      <Link to='/interface-config/'><button className={styles.go_button}>Погнали тестировать</button></Link>
    </div>
  );
};





