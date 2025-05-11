// @ Front-Profesor-Recommendation-System
// @ File Name : Card_Profesor.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente Card_Profesor.
// Representa una tarjeta que muestra información básica de un profesor.

import React from 'react';
import PropTypes from 'prop-types';

const Card_Profesor = ({ 
    id, // ID único del profesor
    Name, // Nombre del profesor
    Image // Imagen del profesor (opcional)
}) => (
    <div className="w-full max-w-sm bg-white border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-end px-4 pt-4"></div>
        <div className="flex flex-col items-center pb-10">
            {/* Imagen del profesor */}
            <img 
                className="w-24 h-24 mb-3 rounded-full shadow-lg border-2 border-teal-200" 
                src={Image || "/api/placeholder/100/100"} // Imagen por defecto si no se proporciona
                alt={`${Name} profile`} 
            />
            {/* Nombre del profesor */}
            <h5 className="mb-1 text-xl font-medium text-gray-900">{Name}</h5>
            <div className="flex mt-4 md:mt-6">
                {/* Botón para asignarse al profesor */}
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 transition-colors duration-300">
                    Asignarse
                </button>
            </div>
        </div>
    </div>
);

// Validación de propiedades
Card_Profesor.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // ID del profesor
    Name: PropTypes.string.isRequired, // Nombre del profesor (requerido)
    Image: PropTypes.string, // Imagen del profesor (opcional)
};

export default Card_Profesor;