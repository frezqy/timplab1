import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  // достаем id товара из адресной строки
  const { id } = useParams();
  const navigate = useNavigate();
  
  // состояние для хранения названия товара
  const [name, setName] = useState('');

  // загружаем данные конкретного товара при открытии страницы
  useEffect(() => {
    axios.get(`http://localhost:5000/items/${id}`)
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => console.error("ошибка загрузки:", error));
  }, [id]);

  // функция сохранения изменений
  const handleSubmit = (e) => {
    // отменяем стандартную перезагрузку страницы
    e.preventDefault();

    // формируем обновленный объект
    const updatedItem = { name };

    // отправляем put запрос для обновления в формате json
    axios.put(`http://localhost:5000/items/${id}`, JSON.stringify(updatedItem), {
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      // возвращаемся на главную
      navigate('/');
    })
    .catch(error => console.error("ошибка обновления:", error));
  };

  return (
    <div>
      <h1>Редактирование товара</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ marginLeft: "10px" }}
          />
        </label>
        <br /><br />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default Detail;