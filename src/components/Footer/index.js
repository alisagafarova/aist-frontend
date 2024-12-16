import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>© 2024 Educational Network Platform. Все права защищены.</p>
        <div className={styles.links}>
          <a href="/terms" className={styles.link}>
            Условия использования
          </a>
          <a href="/privacy" className={styles.link}>
            Политика конфиденциальности
          </a>
        </div>
        <p className={styles.author}>Разработано с любовью</p>
      </div>
    </footer>
  );
};
