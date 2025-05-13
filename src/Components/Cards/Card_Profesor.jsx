// @ Front-Profesor-Recommendation-System
// @ File Name : Card_Profesor.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Card_Profesor
 * 
 * Este componente representa una tarjeta de profesor para la vista de estudiantes.
 * Características:
 * - Muestra información básica del profesor
 * - Diseño minimalista con imagen y nombre
 * - Botón de asignación directo
 * - Efectos hover para mejor interactividad
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renderiza una tarjeta de profesor con información básica
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.id - ID único del profesor
 * @param {string} props.Name - Nombre completo del profesor
 * @param {string} [props.Image] - URL de la imagen del profesor (opcional)
 */
const Card_Profesor = ({ id, Name, Image }) => (
    // Contenedor principal con efectos de hover
    <div className="w-full max-w-sm bg-white border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-end px-4 pt-4"></div>
        
        {/* Contenedor de información del profesor */}
        <div className="flex flex-col items-center pb-10">
            {/* Imagen del profesor con fallback */}
            <img 
                className="w-24 h-24 mb-3 rounded-full shadow-lg border-2 border-teal-200" 
                src={Image || "/api/placeholder/100/100"} // Imagen por defecto si no se proporciona
                alt={`${Name} profile`} 
            />
            
            {/* Nombre del profesor */}
            <h5 className="mb-1 text-xl font-medium text-gray-900">{Name}</h5>
            
            {/* Contenedor del botón de acción */}
            <div className="flex mt-4 md:mt-6">
                {/* Botón de asignación con efectos de hover */}
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 transition-colors duration-300">
                    Asignarse
                </button>
            </div>
        </div>
    </div>
);

// Validación de propiedades con PropTypes
Card_Profesor.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // ID puede ser string o número
    Name: PropTypes.string.isRequired, // Nombre es requerido
    Image: PropTypes.string, // URL de imagen es opcional
};

export default Card_Profesor;