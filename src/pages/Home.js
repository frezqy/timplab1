import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  // создаем локальное состояние для хранения наших товаров
  const [items, setItems] = useState([]);

  // загружаем данные при первой отрисовке страницы
  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => console.error("Ошибка загрузки:", error));
  }, []);

  // функция для удаления товара по клику на кнопку
  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => {
        // фильтруем массив, убирая удаленный товар, чтобы интерфейс обновился
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error("Ошибка удаления:", error));
  };

  return (
    <div>
      <h1>Список товаров</h1>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            <Link to={`/detail/${item.id}`}>{item.name}</Link>
            <button onClick={() => deleteItem(item.id)} style={{ marginLeft: "10px" }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <Link to="/add">Добавить товар</Link>
    </div>
  );
};

export default Home;