import React, { useState } from 'react';
import styles from './ForgotPassword.module.scss';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage('Ссылка для сброса пароля отправлена на вашу почту.');
      } else {
        setMessage(data.message || 'Не удалось отправить ссылку для сброса.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Произошла ошибка. Попробуйте ещё раз.');
    }
  };

  return (
    <div className={styles.auth_page}>
      <h2>Забыли пароль</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Отправить ссылку</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
