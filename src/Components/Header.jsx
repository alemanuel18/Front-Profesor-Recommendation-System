// @ Front-Profesor-Recommendation-System
// @ File Name : Header.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente Header.
// Representa el encabezado de la aplicación, que incluye el logo de la universidad y un botón para cerrar sesión.

import React from 'react';
import UVG from '../assets/uvg.png';

const Header = () => (
    <div className="bg-teal-600 flex justify-between items-center p-4 text-white">
        {/* Logo de la universidad */}
        <a href="/">
            <img src={UVG} alt="UVG Logo" className="h-15" />
        </a>

        {/* Botón para cerrar sesión */}
        <div className="flex items-center lg:order-2">
            <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                Cerrar Sesión
            </a>
        </div>
    </div>
);

export default Header;
