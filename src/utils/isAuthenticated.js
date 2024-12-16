export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Возвращаем true, если токен есть, иначе false
};
