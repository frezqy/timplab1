import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getItems, deleteItem } from '../api';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  // загрузка данных при изменении страницы или поискового запроса
  useEffect(() => {
    setIsLoading(true);
    getItems(page, 6, search)
      .then(res => {
        // выводим ответ сервера в консоль для проверки
        console.log('ответ от сервера:', res.data);

        let fetchedData = [];
        if (Array.isArray(res.data)) {
          fetchedData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          fetchedData = res.data.data;
        }

        if (page === 1) {
          setIncidents(fetchedData);
        } else {
          setIncidents(prev => [...prev, ...fetchedData]);
        }
        
        setHasMore(fetchedData && fetchedData.length > 0);
      })
      .catch(err => {
        // выводим ошибку в консоль
        console.error('ошибка сети:', err);
        toast.error('ошибка при связи с сервером безопасности');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, search]);

  // сброс пагинации при вводе нового текста в поиск
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // обработка удаления с уведомлением
  const handleDelete = (id) => {
    deleteItem(id)
      .then(() => {
        setIncidents(incidents.filter(incident => incident.id !== id));
        toast.success('инцидент успешно удален из базы');
      })
      .catch(() => {
        toast.error('не удалось удалить инцидент');
      });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Панель инцидентов ИБ</h1>
        <Link to="/add" className="btn btn-primary">Зарегистрировать угрозу</Link>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Поиск по названию инцидента..." 
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="grid">
        {incidents.map(incident => (
          <div key={incident.id} className="card">
            <div className="card-header">
              <h3>{incident.title}</h3>
              <span className={`badge ${incident.severity === 'Критическая' ? 'critical' : 'normal'}`}>
                {incident.severity}
              </span>
            </div>
            <p><strong>Цель:</strong> {incident.target}</p>
            <p><strong>Статус:</strong> {incident.status}</p>
            <div className="card-actions">
              <Link to={`/detail/${incident.id}`} className="btn btn-secondary">Детали</Link>
              <button onClick={() => handleDelete(incident.id)} className="btn btn-danger">Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {incidents.length === 0 && !isLoading && (
        <div className="empty-state">Угроз не найдено. Инфраструктура в безопасности!</div>
      )}

      {hasMore && incidents.length > 0 && (
        <div className="load-more-container">
          <button 
            className="btn btn-secondary load-more-btn" 
            onClick={() => setPage(prev => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Показать еще угрозы'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;