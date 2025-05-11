// @ Front-Profesor-Recommendation-System
// @ File Name : Sidebar.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente Sidebar.
// Representa un menú lateral fijo que muestra el nombre del estudiante y opciones de navegación.

import React from 'react';

const Sidebar = ({Name}) => (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
                <li>
                    {/* Muestra el nombre del estudiante */}
                    <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span className="ms-3">{Name}</span>
                    </a>
                </li>
            </ul>
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                    {/* Opción de navegación para asignación */}
                    <a className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                        <span className="ms-3">ASIGNACIÓN</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
);      

export default Sidebar;