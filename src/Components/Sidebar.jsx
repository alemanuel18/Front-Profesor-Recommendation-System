// @ Front-Profesor-Recommendation-System
// @ File Name : Sidebar.jsx
// @ Date : 24/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Sidebar
 * 
 * Este componente implementa la barra lateral de navegación para estudiantes.
 * Características:
 * - Posición fija en el lado izquierdo de la pantalla
 * - Muestra el nombre del estudiante (clickeable para ir al perfil)
 * - Proporciona enlaces de navegación
 * - Diseño responsivo con tema claro/oscuro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.Name - Nombre del estudiante a mostrar
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({Name}) => {
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Maneja la navegación al perfil del estudiante
     */
    const handleProfileClick = () => {
        navigate('/student-details');
    };

    /**
     * Maneja la navegación a asignación de cursos
     */
    const handleAssignationClick = () => {
        navigate('/dashboard'); // o la ruta que corresponda para asignación
    };

    /**
     * Verifica si una ruta está activa
     */
    const isActiveRoute = (route) => {
        return location.pathname === route;
    };

    return (
        // Contenedor principal de la barra lateral
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto">
                {/* Lista superior - Información del estudiante */}
                <ul className="space-y-2 font-medium">
                    <li>
                        {/* Perfil del estudiante - Clickeable */}
                        <button
                            onClick={handleProfileClick}
                            className={`w-full flex items-center p-2 text-left rounded-lg transition-colors duration-200 group ${
                                isActiveRoute('/student-details')
                                    ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100'
                                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {/* Icono de usuario */}
                            <svg 
                                className={`w-5 h-5 transition duration-75 ${
                                    isActiveRoute('/student-details')
                                        ? 'text-teal-600 dark:text-teal-300'
                                        : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                                }`} 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>
                            <span className="flex-1 ms-3 text-left">{Name}</span>
                            {/* Indicador de que es clickeable */}
                            <svg 
                                className={`w-4 h-4 transition duration-75 ${
                                    isActiveRoute('/student-details')
                                        ? 'text-teal-600 dark:text-teal-300'
                                        : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </li>
                </ul>
                
                {/* Lista inferior - Opciones de navegación */}
                <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                    <li>
                        {/* Enlace de asignación de cursos */}
                        <button
                            onClick={handleAssignationClick}
                            className={`w-full flex items-center p-2 text-left rounded-lg transition-colors duration-200 group ${
                                isActiveRoute('/dashboard')
                                    ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100'
                                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {/* Icono de asignación */}
                            <svg 
                                className={`w-5 h-5 transition duration-75 ${
                                    isActiveRoute('/dashboard')
                                        ? 'text-teal-600 dark:text-teal-300'
                                        : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                                }`}
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="currentColor" 
                                viewBox="0 0 18 18"
                            >
                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                            </svg>
                            <span className="flex-1 ms-3 text-left">ASIGNACIÓN</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};      

// Validación de propiedades
Sidebar.propTypes = {
    Name: PropTypes.string.isRequired // El nombre es requerido
};

export default Sidebar;