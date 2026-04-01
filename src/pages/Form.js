import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Form = () => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    api.createItem({ name })
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        alert('Ошибка при создании товара');
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <h1>Добавление товара</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </label>
        <br /><br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
};

export default Form;