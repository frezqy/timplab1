import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from '../api';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // получение данных с сервера
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = () => {
    getItems()
      .then(res => {
        setIncidents(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('ошибка при загрузке данных');
        setIsLoading(false);
      });
  };

  // удаление инцидента
  const handleDelete = (id) => {
    deleteItem(id).then(() => {
      setIncidents(incidents.filter(incident => incident.id !== id));
    });
  };

  if (isLoading) return <div className="loader">Загрузка данных безопасности...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Панель инцидентов ИБ</h1>
        <Link to="/add" className="btn btn-primary">Добавить инцидент</Link>
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
    </div>
  );
}

export default Home;