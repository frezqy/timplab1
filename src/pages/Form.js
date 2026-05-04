import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createItem } from '../api';

function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    severity: 'Низкая',
    status: 'Открыт',
    target: '',
    date: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // отправка формы с алёртами
  const handleSubmit = (e) => {
    e.preventDefault();
    createItem(formData)
      .then(() => {
        toast.success('новый инцидент успешно добавлен');
        navigate('/');
      })
      .catch(() => {
        toast.error('произошла ошибка при сохранении');
      });
  };

  // отмена добавления
  const handleCancel = () => {
    toast.info('добавление инцидента отменено');
    navigate('/');
  };

  return (
    <div className="container form-container">
      <h2>Регистрация нового инцидента</h2>
      <form onSubmit={handleSubmit} className="security-form">
        <div className="form-group">
          <label>название угрозы:</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label>критичность:</label>
          <select name="severity" value={formData.severity} onChange={handleChange}>
            <option value="Низкая">Низкая</option>
            <option value="Средняя">Средняя</option>
            <option value="Высокая">Высокая</option>
            <option value="Критическая">Критическая</option>
          </select>
        </div>

        <div className="form-group">
          <label>статус:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Открыт">Открыт</option>
            <option value="В работе">В работе</option>
            <option value="Решен">Решен</option>
          </select>
        </div>

        <div className="form-group">
          <label>атакованный узел:</label>
          <input type="text" name="target" required value={formData.target} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>дата инцидента:</label>
          <input type="date" name="date" required value={formData.date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>описание:</label>
          <textarea name="description" required value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">зарегистрировать</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>отмена</button>
        </div>
      </form>
    </div>
  );
}

export default Form;