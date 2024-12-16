import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/slices'; // Импортируем Redux-действие login
import styles from './Login.module.scss';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Для отображения ошибок
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
   

      if (response.ok) {
        // Передаём токен и данные пользователя в Redux
        dispatch(login({ token: data.token, userData: data }));
  
        // Перенаправляем на главную страницу
        navigate('/');
      } else {
        setErrorMessage(data.message || 'Login failed'); // Отображаем сообщение об ошибке
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Произошла ошибка. Попробуйте ещё раз.');
    }
  };
  

  return (
    <div className={styles.auth_page}>
      <h2>Войти</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
      {errorMessage && <p className={styles.error_message}>{errorMessage}</p>}
      <p className={styles.auth_link}>
        Нет аккаунта? <a href="/register">Регистрация</a>
      </p>
      <p className={styles.forgot_password}>
        <a href="/forgot-password">Забыли пароль?</a>
      </p>
    </div>
  );
};
