import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DeliveryPage } from './pages/DeliveryPage';

// Проверка авторизации для закрытых роутов
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <Navigate dangerouslySetInnerHTML={{ __html: '' }} to="/auth" replace />;
  return <>{children}</>;
};

// Заглушки страниц от других разрабов
const HomePage = () => <div>Главная страница</div>;
const CartPage = () => <div>Корзина</div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route 
            path="/cart" 
            element={<ProtectedRoute><CartPage /></ProtectedRoute>} 
          />
          <Route 
            path="/delivery" 
            element={<ProtectedRoute><DeliveryPage /></ProtectedRoute>} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// ВОТ ЭТА СТРОЧКА РЕШАЕТ ТВОЮ ОШИБКУ:
export default App;