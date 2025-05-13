// @ Front-Profesor-Recommendation-System
// @ File Name : AdminProtectedRoute.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente AdminProtectedRoute
 * 
 * Este componente implementa una capa de seguridad para rutas administrativas.
 * Características:
 * - Verifica autenticación del usuario
 * - Valida el rol de administrador
 * - Maneja estados de carga
 * - Implementa redirecciones según permisos
 * 
 * Flujo de verificación:
 * 1. Verifica si está cargando -> Muestra spinner
 * 2. Verifica si hay usuario -> Redirige a login si no
 * 3. Verifica si es admin -> Redirige a inicio si no
 * 4. Permite acceso si pasa todas las verificaciones
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de orden superior para proteger rutas administrativas
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si la autenticación es exitosa
 */
const AdminProtectedRoute = ({ children }) => {
  // ===== HOOKS Y CONTEXTO =====
  const { currentUser, loading, isAdmin } = useAuth();
  
  // ===== RENDERIZADO CONDICIONAL =====
  
  // Estado de carga - Muestra spinner mientras verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Verificación de autenticación
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Verificación de permisos de administrador
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  
  // Usuario autenticado y con permisos - Renderiza el contenido protegido
  return children;
};

export default AdminProtectedRoute;