import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Вызываем логин из контекста
    await login('test@example.com', 'password');
    
    // Перекидываем на доставку
    navigate('/delivery');
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form 
        onSubmit={handleSubmit} 
        data-registration={!isLogin ? "true" : "false"}
      >
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Пароль" required />
        {!isLogin && <input type="text" placeholder="Имя" required />}
        
        <button type="submit">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        style={{marginTop: '10px', background: 'none', border: 'none', color: '#646cff', textDecoration: 'underline', cursor: 'pointer'}}
      >
        {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
};