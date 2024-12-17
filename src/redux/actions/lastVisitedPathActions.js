// src/redux/actions/lastVisitedPathActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Асинхронное действие для отправки пути на сервер

export const saveLastVisitedPath = createAsyncThunk(
  'terminal/saveLastVisitedPath',
  async (path, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/last-page`,
        { lastVisitedPath: path },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      return path; // Возвращаем путь, если запрос успешен
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при отправке пути на сервер');
    }
  },
);
