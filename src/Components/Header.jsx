// @ Front-Profesor-Recommendation-System
// @ File Name : Header.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente Header.
// Representa el encabezado de la aplicación, que incluye el logo de la universidad y un botón para cerrar sesión.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UVG from '../assets/uvg.png';

const Header = () => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-teal-600 flex justify-between items-center p-4 text-white">
            {/* Logo de la universidad */}
            <Link to="/">
                <img src={UVG} alt="UVG Logo" className="h-15" />
            </Link>

            {/* Información del usuario y botón para cerrar sesión */}
            <div className="flex items-center space-x-4">
                {currentUser && (
                    <span className="hidden md:inline text-sm font-medium">
                        {currentUser.name}
                    </span>
                )}
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