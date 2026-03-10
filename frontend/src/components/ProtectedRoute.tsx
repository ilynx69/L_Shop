import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};