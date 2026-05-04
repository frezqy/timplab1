import axios from 'axios';

// настройка подключения к серверу
const api = axios.create({
  baseURL: 'https://timplab1.onrender.com'
});

// получение инцидентов с учетом новой версии json-server
export const getItems = (page = 1, limit = 6, query = '') => {
  let url = `/items?_page=${page}&_per_page=${limit}`;
  if (query) {
    url += `&q=${query}`;
  }
  return api.get(url);
};

export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data);
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);