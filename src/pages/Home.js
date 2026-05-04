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

  // 1. Загрузка данных при изменении страницы или поиска
  useEffect(() => {
    setIsLoading(true);
    getItems(page, 12, search)
      .then(res => {
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
        
        // Если пришло меньше 6 элементов или вообще пусто - значит это конец базы
        setHasMore(fetchedData && fetchedData.length === 12);
      })
      .catch(err => {
        console.error(err);
        toast.error('ошибка при загрузке инцидентов');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, search]);

  // 2. Магия бесконечного скролла (Infinite Scroll)
  useEffect(() => {
    const handleScroll = () => {
      // Вычисляем, докрутил ли пользователь до низа страницы (с запасом в 100 пикселей)
      const isBottom = 
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.scrollHeight;

      // Если дошли до низа, есть еще данные и прямо сейчас ничего не грузится
      if (isBottom && hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1); // автоматически грузим следующую страницу
      }
    };

    // Вешаем слушатель при монтировании и убираем при размонтировании
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  // 3. Обработка поиска
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // сбрасываем на первую страницу при новом поиске
  };

  // 4. Удаление
  const handleDelete = (id) => {
    deleteItem(id)
      .then(() => {
        setIncidents(incidents.filter(incident => incident.id !== id));
        toast.success('инцидент успешно удален');
      })
      .catch(() => {
        toast.error('не удалось удалить запись');
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

      {/* Индикатор загрузки в самом низу при скролле */}
      {isLoading && (
        <div className="load-more-container">
          <p>Подгружаем данные...</p>
        </div>
      )}
    </div>
  );
}

export default Home;