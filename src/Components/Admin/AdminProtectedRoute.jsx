// @ Front-Profesor-Recommendation-System
// @ File Name : AdminProtectedRoute.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este componente protege las rutas que requieren autenticación y rol de administrador.
// Redirige a los usuarios no autenticados o sin permisos a la página correspondiente.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
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
  
  // Si el usuario no es administrador, redirigir a la página principal
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  // Si hay usuario autenticado y es admin, mostrar la ruta protegida
  return children;
};

export default AdminProtectedRoute;