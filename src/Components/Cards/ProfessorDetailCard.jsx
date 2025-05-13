// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorDetailCard.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente ProfessorDetailCard
 * 
 * Este componente representa una tarjeta detallada con toda la información
 * de un profesor, incluyendo datos personales, profesionales y académicos.
 * Características:
 * - Vista detallada de la información del profesor
 * - Diseño responsivo con grid layout
 * - Sistema visual de calificación
 * - Manejo de estados sin datos
 * - Organización clara de la información
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renderiza una tarjeta con información detallada del profesor
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.professor - Datos completos del profesor
 */
const ProfessorDetailCard = ({ professor }) => {
  // Manejo de caso sin datos
  if (!professor) {
    return (
      <div className="w-full max-w-3xl p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <p className="text-center text-gray-500">No se encontraron datos del profesor</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      {/* Encabezado con imagen y datos principales */}
      <div className="relative bg-teal-600 p-8 text-white">
        <div className="flex items-center">
          {/* Imagen de perfil */}
          <img 
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg" 
            src={professor.image || "/api/placeholder/200/200"} 
            alt={`${professor.name} profile`} 
          />
          {/* Información básica */}
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{professor.name}</h2>
            <p className="text-teal-100">{professor.degree || professor.exp}</p>
          </div>
        </div>
      </div>
      
      {/* Cuerpo de la tarjeta - Información detallada */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Información de contacto y evaluación */}
          <div className="space-y-4">
            {/* Sección de información de contacto */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-2 mb-2">
                Información de Contacto
              </h3>
              <p><span className="font-medium">Departamento:</span> {professor.department}</p>
              <p><span className="font-medium">Email:</span> {professor.email}</p>
              <p><span className="font-medium">Teléfono:</span> {professor.phone}</p>
            </div>
            
            {/* Sección de evaluación */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-2 mb-2">
                Evaluación
              </h3>
              <div className="flex items-center">
                {/* Sistema visual de calificación con estrellas */}
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(professor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-bold">{professor.rating}</span>
                <span className="text-gray-500 text-sm ml-2">/5</span>
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Especialidades y cursos */}
          <div className="space-y-4">
            {/* Sección de especialidades */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-2 mb-2">
                Especialidades
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {professor.specialties?.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </div>
            
            {/* Sección de cursos */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-2 mb-2">
                Cursos que Imparte
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {professor.courses?.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Validación detallada de propiedades
ProfessorDetailCard.propTypes = {
  professor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    degree: PropTypes.string,
    exp: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    courses: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number
  })
};

export default ProfessorDetailCard;