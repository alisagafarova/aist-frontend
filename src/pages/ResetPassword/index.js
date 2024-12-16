import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ResetPassword.module.scss';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Пароль успешно сброшен!');
        setTimeout(() => navigate('/login'), 2000); // Перенаправляем на страницу входа
      } else {
        setError(data.message || 'Не удалось сбросить пароль.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Произошла ошибка. Попробуйте ещё раз.');
    }
  };

  return (
    <div className={styles.auth_page}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Сбросить пароль</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error_message}>{error}</p>}
    </div>
  );
};
