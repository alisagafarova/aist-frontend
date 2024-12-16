import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); // Перенаправляем на страницу входа
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.auth_page}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className={styles.auth_form}>
        <input
          type="text"
          placeholder="Имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
        <button type="submit">Регистрация</button>
      </form>
      <p className={styles.auth_link}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
};