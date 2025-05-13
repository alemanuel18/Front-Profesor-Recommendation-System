// @ Front-Profesor-Recommendation-System
// @ File Name : Header.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Header
 * 
 * Este componente implementa el encabezado principal de la aplicación.
 * Características:
 * - Muestra el logo de la universidad como enlace a la página principal
 * - Exhibe el nombre del usuario actual
 * - Proporciona funcionalidad de cierre de sesión
 * - Diseño responsivo con Tailwind CSS
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UVG from '../assets/uvg.png';

const Header = () => {
    // ===== HOOKS Y CONTEXTO =====
    const { logout, currentUser } = useAuth(); // Obtiene funciones y datos de autenticación
    const navigate = useNavigate(); // Hook para navegación programática
    
    /**
     * Maneja el cierre de sesión del usuario
     * - Ejecuta la función logout del contexto de autenticación
     * - Redirige al usuario a la página de login
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="bg-teal-600 flex justify-between items-center p-4 text-white">
            {/* Logo de la universidad con enlace a inicio */}
            <Link to="/">
                <img src={UVG} alt="UVG Logo" className="h-15" />
            </Link>

            {/* Panel derecho: información de usuario y botón de logout */}
            <div className="flex items-center space-x-4">
                {/* Nombre del usuario - visible solo en pantallas medianas o más grandes */}
                {currentUser && (
                    <span className="hidden md:inline text-sm font-medium">
                        {currentUser.name}
                    </span>
                )}
                
                {/* Botón de cierre de sesión */}
                <button 
                    onClick={handleLogout}
                    className="bg-white text-teal-700 hover:bg-gray-100 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 transition-colors duration-200"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Header;