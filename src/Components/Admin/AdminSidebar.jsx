// @ Front-Profesor-Recommendation-System
// @ File Name : AdminSidebar.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente AdminSidebar
 * 
 * Este componente implementa la barra lateral para el panel de administración.
 * Características:
 * - Muestra información del administrador actual
 * - Proporciona navegación entre secciones administrativas
 * - Indica visualmente la sección activa
 * - Diseño consistente con la identidad visual
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  // ===== HOOKS Y CONTEXTO =====
  const { currentUser } = useAuth(); // Obtiene datos del usuario actual
  const location = useLocation(); // Hook para obtener la ruta actual
  
  /**
   * Determina si un enlace está activo basado en la ruta actual
   * @param {string} path - Ruta a verificar
   * @returns {string} Clase CSS para el estado activo
   */
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-teal-700' : '';
  };

  // ===== ESTRUCTURA DEL COMPONENTE =====
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-teal-800 text-white" aria-label="Admin Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Encabezado con información del administrador */}
        <div className="flex items-center mb-5 pb-3 border-b border-teal-700">
          {/* Avatar del administrador */}
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mr-3">
            <span className="text-xl font-bold">A</span>
          </div>
          {/* Información del administrador */}
          <div>
            <p className="font-medium text-sm">{currentUser?.name || 'Administrador'}</p>
            <p className="text-xs text-teal-300">Panel de Administración</p>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="space-y-1">

          {/* Gestión de Profesores */}
          <Link
            to="/admin/professors"
            className={`flex items-center px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors ${isActive('/admin/professors')}`}
          >
            <span>Profesores</span>
          </Link>

        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;