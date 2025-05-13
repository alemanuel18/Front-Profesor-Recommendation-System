// @ Front-Profesor-Recommendation-System
// @ File Name : AdminSidebar.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente AdminSidebar.
// Representa un menú lateral para administradores con opciones específicas de gestión.

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Determinar si un enlace está activo basado en la ruta actual
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-teal-700' : '';
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-teal-800 text-white" aria-label="Admin Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="flex items-center mb-5 pb-3 border-b border-teal-700">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center mr-3">
            <span className="text-xl font-bold">A</span>
          </div>
          <div>
            <p className="font-medium text-sm">{currentUser?.name || 'Administrador'}</p>
            <p className="text-xs text-teal-300">Panel de Administración</p>
          </div>
        </div>
        

      </div>
    </aside>
  );
};

export default AdminSidebar;