import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import './App.css';

// главный компонент приложения
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<Form />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} /> 
    </Router>
  );
}

export default App;