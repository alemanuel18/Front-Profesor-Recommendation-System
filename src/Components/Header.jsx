import React from 'react';
import UVG from '../assets/uvg.png';

const Header = () => (
    <div className="bg-teal-600 flex justify-between items-center p-4 text-white">
        <a href="/">
            <img src={UVG} alt="UVG Logo" className="h-15" />
        </a>

        <div class="flex items-center lg:order-2">
            <a href="#" class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Cerrar Sesión</a>
        </div>
    </div>
);

export default Header;
