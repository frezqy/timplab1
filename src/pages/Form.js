import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  // создаем ссылку для доступа к значению из поля ввода
  const nameRef = useRef(null);
  // хук для программного перехода между страницами
  const navigate = useNavigate();

  // функция, которая сработает при нажатии на кнопку добавления
  const handleSubmit = (e) => {
    // предотвращаем стандартную перезагрузку страницы браузером
    e.preventDefault();

    // формируем объект с новым товаром
    const newItemData = {
      name: nameRef.current.value,
    };

    // отправляем данные на сервер строго в формате json
    axios.post("http://localhost:5000/items", JSON.stringify(newItemData), {
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      // если все ок, перекидываем пользователя обратно на главную страницу
      navigate('/');
    })
    .catch(error => console.error("ошибка при создании:", error));
  };

  return (
    <div>
      <h1>Новый товар</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input type="text" ref={nameRef} required style={{ marginLeft: "10px" }} />
        </label>
        <br /><br />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default Form;