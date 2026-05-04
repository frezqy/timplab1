import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../api';

function Detail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);

  // загрузка информации по id
  useEffect(() => {
    getItem(id).then(res => setIncident(res.data));
  }, [id]);

  if (!incident) return <div className="loader">поиск деталей...</div>;

  return (
    <div className="container detail-container">
      <div className="detail-card">
        <h2>{incident.title}</h2>
        <div className="detail-info">
          <p><strong>ID инцидента:</strong> {incident.id}</p>
          <p><strong>Дата обнаружения:</strong> {incident.date}</p>
          <p><strong>Цель:</strong> {incident.target}</p>
          <p><strong>Критичность:</strong> <span className="highlight">{incident.severity}</span></p>
          <p><strong>Текущий статус:</strong> {incident.status}</p>
        </div>
        <div className="detail-desc">
          <h3>Описание:</h3>
          <p>{incident.description}</p>
        </div>
        <Link to="/" className="btn btn-secondary">Вернуться к списку</Link>
      </div>
    </div>
  );
}

export default Detail;