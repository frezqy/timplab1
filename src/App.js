import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// импортируем наши страницы из папки
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';

const App = () => {
  // настраиваем пути для компонентов
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<Form />} />
      </Routes>
    </Router>
  );
};

export default App;