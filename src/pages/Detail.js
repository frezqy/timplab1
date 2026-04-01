import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // режим редактирования
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    api.getItem(id)
      .then(response => {
        setItem(response.data);
        setEditName(response.data.name);
        setLoading(false);
      })
      .catch(() => {
        setError('Товар не найден или произошла ошибка сервера');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    api.updateItem(id, { name: editName })
      .then(response => {
        setItem(response.data);
        setIsEditing(false); // выходим из режима редактирования
      })
      .catch(() => alert('Ошибка при сохранении изменений'));
  };

  if (loading) return <div>Загрузка данных товара...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Детальная информация</h1>
      
      {!isEditing ? (
        /* Режим просмотра */
        <div>
          <p><strong>ID:</strong> {item.id}</p>
          <p><strong>Название:</strong> {item.name}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        </div>
      ) : (
        /* Режим редактирования */
        <form onSubmit={handleUpdate}>
          <label>
            Изменить название:
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              required 
            />
          </label>
          <br /><br />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
            Отмена
          </button>
        </form>
      )}
      <br />
      <Link to="/">Вернуться к списку</Link>
    </div>
  );
};

export default Detail;