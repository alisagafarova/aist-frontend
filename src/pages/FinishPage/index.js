import React, { useState, useEffect } from 'react';
import styles from './FinishPage.module.scss';
import emailjs from '@emailjs/browser';
import FinishCatImg from '../../images/ final_cat.png';

export const FinishPage = () => {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState(''); // Поле "От кого"
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
    if (feedback.trim() && name.trim()) {
      setIsLoading(true);
      emailjs
        .send(
          'service_6fg73hu', // Ваш Service ID
          'template_nh4xm3a', // Ваш Template ID
          {
            feedback: feedback,
            from_name: name, // Новое поле "От кого"
            cc_email: 'sergey.ovintsovskiy@gmail.com', // Основной адрес
            cc_email: 'gafarova011094@gmail.com', // Копия
          },
          'yEzNSiFDOX7CNS4Ly', // Ваш Public Key
        )
        .then(() => {
          setSubmitted(true);
          setFeedback('');
          setName(''); // Очищаем поле "От кого"
        })
        .catch((error) => {
          console.error('Ошибка при отправке отзыва:', error);
          alert('Не удалось отправить отзыв. Попробуйте позже.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      alert('Пожалуйста, заполните все поля перед отправкой.');
    }
  };

  return (
    <div className={styles.finish_page}>
      <h1>Спасибо за участие в бета-тестировании!</h1>

      <p>
        Мы благодарим вас за то, что вы стали частью нашей образовательной платформы, посвященной
        основам сетевых технологий. Ваши отзывы и пожелания помогут нам сделать проект ещё лучше!
      </p>
      <h2>Ваше имя:</h2>
      <input
        type="text"
        className={styles.name_input}
        value={name}
        onChange={handleNameChange}
        placeholder="Введите ваше имя"
        disabled={isLoading || submitted} // Блокируем ввод после отправки
      />
      <h2>Оставьте отзыв:</h2>
      <textarea
        className={styles.feedback_input}
        value={feedback}
        onChange={handleFeedbackChange}
        placeholder="Ваши комментарии и пожелания..."
        rows="5"
        disabled={isLoading || submitted} // Блокируем ввод после отправки
      />
      <img src={FinishCatImg} className={styles.finish_image} />
      <button
        className={styles.submit_button}
        onClick={handleSubmit}
        disabled={isLoading || submitted} // Блокируем кнопку после отправки
      >
        {isLoading ? 'Отправка...' : submitted ? 'Отзыв отправлен' : 'Отправить отзыв'}
      </button>
      {submitted && <p className={styles.thank_you}>Ваш отзыв отправлен! Спасибо!</p>}
    </div>
  );
};
