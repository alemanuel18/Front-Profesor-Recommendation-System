// @ Front-Profesor-Recommendation-System
// @ File Name : Sidebar.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Sidebar
 * 
 * Este componente implementa la barra lateral de navegación para estudiantes.
 * Características:
 * - Posición fija en el lado izquierdo de la pantalla
 * - Muestra el nombre del estudiante
 * - Proporciona enlaces de navegación
 * - Diseño responsivo con tema claro/oscuro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.Name - Nombre del estudiante a mostrar
 */

import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({Name}) => (
    // Contenedor principal de la barra lateral
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto">
            {/* Lista superior - Información del estudiante */}
            <ul className="space-y-2 font-medium">
                <li>
                    {/* Muestra el nombre del estudiante */}
                    <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span className="ms-3">{Name}</span>
                    </a>
                </li>
            </ul>
            
            {/* Lista inferior - Opciones de navegación */}
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                    {/* Enlace de asignación de cursos */}
                    <a className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                        <span className="ms-3">ASIGNACIÓN</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
);      

// Validación de propiedades
Sidebar.propTypes = {
    Name: PropTypes.string.isRequired // El nombre es requerido
};

export default Sidebar;