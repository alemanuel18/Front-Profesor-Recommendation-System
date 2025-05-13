// @ Front-Profesor-Recommendation-System
// @ File Name : ProtectedRoute.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente ProtectedRoute
 * 
 * Este componente implementa la protección de rutas en la aplicación.
 * Funcionalidad:
 * - Verifica si existe un usuario autenticado
 * - Redirige a usuarios no autenticados a la página de login
 * - Muestra un indicador de carga durante la verificación
 * - Renderiza el contenido protegido solo para usuarios autenticados
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // ===== HOOKS Y CONTEXTO =====
  const { currentUser, loading } = useAuth(); // Obtiene el estado de autenticación
  
  // ===== RENDERIZADO CONDICIONAL =====
  
  // Muestra spinner durante la verificación de autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirige a login si no hay usuario autenticado
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Renderiza el contenido protegido si el usuario está autenticado
  return children;
};

export default ProtectedRoute;