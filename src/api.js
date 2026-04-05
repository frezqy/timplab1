import axios from 'axios';

// базовый адрес нашего сервера
const API_URL = 'https://timplab1.onrender.com';

// экспортируем объект со всеми нужными функциями
export const api = {
  // получение всех товаров
  getItems: () => axios.get(API_URL),
  // получение одного товара по айди
  getItem: (id) => axios.get(`${API_URL}/${id}`),
  // создание нового товара
  createItem: (item) => axios.post(API_URL, JSON.stringify(item), { 
    headers: { "Content-Type": "application/json" } 
  }),
  // обновление существующего товара
  updateItem: (id, item) => axios.put(`${API_URL}/${id}`, JSON.stringify(item), { 
    headers: { "Content-Type": "application/json" } 
  }),
  // удаление товара
  deleteItem: (id) => axios.delete(`${API_URL}/${id}`)
};