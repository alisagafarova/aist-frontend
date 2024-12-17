import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveLastVisitedPath } from '../redux/actions/lastVisitedPathActions';

const allowedPaths = [
  '/intro/',
  '/interface-config/',
  '/interface-config/task1/',
  '/static-route/',
  '/static-route/task2/',
  '/network-config/',
  '/network-config/task3/',
];

export const useSaveLastVisitedPath = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const path = location.pathname;
    if (allowedPaths.includes(path)) {
      // Сохраняем путь и отправляем его на сервер
      dispatch(saveLastVisitedPath(path));
    }
  }, [location, dispatch]);
};
