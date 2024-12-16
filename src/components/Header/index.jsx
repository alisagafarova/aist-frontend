import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../redux/slices/slices'; // Импортируем Redux-действие logout
import styles from './Header.module.scss';
import logo from '../../images/logo_stokrk.png';

export const Header = () => {
  const isAuthenticated = useSelector((state) => state.terminal.auth.isAuthenticated); // Используем Redux-состояние
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Перенаправляем на страницу входа
  };

  const handleLogoutClick = () => {
    dispatch(logout()); // Сбрасываем авторизацию в Redux
    // Удаляем последний путь из localStorage
  localStorage.removeItem('lastVisitedPath');
    navigate('/'); // Перенаправляем на главную
  };

  return (
    <div className={styles.root}>
      <Link className={styles.logo} to="/">
        <img className={styles.logo_header} src={logo} alt="Menu Logo" />
      </Link>
      <div className={styles.authButton}>
        {isAuthenticated ? (
          <button onClick={handleLogoutClick} className={styles.logoutButton}>
            Выйти
          </button>
        ) : (
          <button onClick={handleLoginClick} className={styles.loginButton}>
            Войти
          </button>
        )}
      </div>
    </div>
  );
};
