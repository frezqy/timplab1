import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api'; // импортируем наш сервис

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // состояние загрузки
  const [error, setError] = useState(null);    // состояние ошибки

  useEffect(() => {
    console.log("Пытаюсь загрузить данные..."); 
    api.getItems()
      .then(res => {
        console.log("Данные получены:", res.data); 
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка запроса:", err); 
        setLoading(false);
      });
  }, []);


  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      api.deleteItem(id)
        .then(() => {
          setItems(items.filter(item => item.id !== id));
        })
        .catch(() => alert('Ошибка при удалении'));
    }
  };

  if (loading) return <div>Загрузка списка товаров...</div>; // наш "спиннер"
  if (error) return <div style={{ color: 'red' }}>{error}</div>; // отображение ошибки

  return (
    <div>
      <h1>Список товаров</h1>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: '10px' }}>
            <Link to={`/detail/${item.id}`}>{item.name}</Link>
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px' }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <Link to="/add">Добавить новый товар</Link>
    </div>
  );
};

export default Home;