import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const authStatus = localStorage.getItem('auth');
    if (authStatus === 'true') {
      setIsAuth(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuth={setIsAuth} />} 
        />
        <Route 
          path="/" 
          element={isAuth ? <Home setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/detail/:id" 
          element={isAuth ? <Detail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/add" 
          element={isAuth ? <Form /> : <Navigate to="/login" />} 
        />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;