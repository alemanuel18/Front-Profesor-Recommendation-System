// @ Front-Profesor-Recommendation-System
// @ File Name : ProtectedRoute.jsx
// @ Date : 11/05/2025
// @ Author : Sistema de Autenticación
//

// Este componente protege las rutas que requieren autenticación.
// Redirige a los usuarios no autenticados a la página de login.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Si aún está cargando, no mostrar nada
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Si hay usuario autenticado, mostrar la ruta protegida
  return children;
};

export default ProtectedRoute;