import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getItems, deleteItem } from '../api';

function Home({ setIsAuth }) {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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
        
        setHasMore(fetchedData && fetchedData.length === 12);
      })
      .catch(err => {
        toast.error('ошибка при получении данных с сервера');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, search]);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = 
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.scrollHeight;

      if (isBottom && hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // физическое удаление на сервере
  const confirmDelete = (id, toastId) => {
    toast.dismiss(toastId);
    deleteItem(id)
      .then(() => {
        setIncidents(incidents.filter(incident => incident.id !== id));
        toast.success('инцидент окончательно удален');
      })
      .catch(() => {
        toast.error('не удалось удалить инцидент');
      });
  };

  // отмена удаления
  const cancelDelete = (toastId) => {
    toast.dismiss(toastId);
    toast.info('удаление отменено');
  };

  // показ алёрта с выбором действия
  const handleDeleteRequest = (id) => {
    const toastId = toast(
      <div className="toast-confirm">
        <p>вы уверены, что хотите удалить этот инцидент?</p>
        <div className="toast-buttons">
          <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(id, toastId)}>да, удалить</button>
          <button className="btn btn-secondary btn-sm" onClick={() => cancelDelete(toastId)}>отмена</button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  // выход из системы
  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuth(false);
    toast.info('вы вышли из системы');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Панель инцидентов ИБ</h1>
        <div className="header-actions">
          <Link to="/add" className="btn btn-primary">зарегистрировать угрозу</Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px' }}>выйти</button>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="поиск по названию инцидента..." 
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
            <p><strong>цель:</strong> {incident.target}</p>
            <p><strong>статус:</strong> {incident.status}</p>
            <div className="card-actions">
              <Link to={`/detail/${incident.id}`} className="btn btn-secondary">детали</Link>
              <button onClick={() => handleDeleteRequest(incident.id)} className="btn btn-danger">удалить</button>
            </div>
          </div>
        ))}
      </div>

      {incidents.length === 0 && !isLoading && (
        <div className="empty-state">угроз не найдено. инфраструктура в безопасности!</div>
      )}

      {isLoading && (
        <div className="load-more-container">
          <p>подгружаем данные...</p>
        </div>
      )}
    </div>
  );
}

export default Home;