// @ Front-Profesor-Recommendation-System
// @ File Name : Card_Profesor_Admin.jsx
// @ Date : 12/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Card_Profesor_Admin
 * 
 * Este componente representa una tarjeta de profesor en la vista de administrador.
 * Características:
 * - Muestra información detallada del profesor
 * - Incluye calificación con visualización de estrellas
 * - Muestra especialidades del profesor
 * - Permite navegación a vista detallada
 * - Diseño responsivo y con efectos visuales
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * Renderiza una tarjeta de profesor con información detallada para administradores
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.id - ID único del profesor
 * @param {string} props.name - Nombre del profesor
 * @param {string} [props.image] - URL de la imagen del profesor
 * @param {string} props.department - Departamento al que pertenece
 * @param {number} props.rating - Calificación del profesor (0-5)
 * @param {string[]} props.specialties - Lista de especialidades
 */
const Card_Profesor_Admin = ({ 
    id,
    name,
    image,
    department,
    rating,
    specialties
}) => {
    const navigate = useNavigate();

    /**
     * Maneja la navegación a la página de detalles del profesor
     */
    const handleViewDetails = () => {
        navigate(`/admin/professors/${id}`);
    };

    return (
        // Contenedor principal con efectos de hover
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-5">
                {/* Sección de información principal */}
                <div className="flex flex-col items-center pb-6">
                    {/* Imagen del profesor con fallback */}
                    <img 
                        className="w-24 h-24 mb-3 rounded-full shadow-lg border-2 border-teal-200" 
                        src={image || "/api/placeholder/100/100"}
                        alt={`${name} profile`} 
                    />
                    
                    {/* Información básica */}
                    <h5 className="mb-1 text-xl font-semibold text-gray-900">{name}</h5>
                    <span className="text-sm text-gray-600 mb-2">{department}</span>
                    
                    {/* Sistema de calificación con estrellas */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                                <svg 
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-bold">{rating}</span>
                    </div>
                    
                    {/* Sección de especialidades */}
                    <div className="mb-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">Especialidades:</p>
                        <div className="flex flex-wrap justify-center gap-1">
                            {/* Muestra las primeras 2 especialidades */}
                            {specialties && specialties.slice(0, 2).map((specialty, index) => (
                                <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                                    {specialty}
                                </span>
                            ))}
                            {/* Indica si hay más especialidades */}
                            {specialties && specialties.length > 2 && (
                                <span className="text-xs text-gray-500">+{specialties.length - 2} más</span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Botón de acción */}
                <div className="flex justify-center">
                    <button 
                        onClick={handleViewDetails}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 transition-colors duration-300"
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};

// Validación de propiedades
Card_Profesor_Admin.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    department: PropTypes.string,
    rating: PropTypes.number,
    specialties: PropTypes.arrayOf(PropTypes.string)
};

export default Card_Profesor_Admin;