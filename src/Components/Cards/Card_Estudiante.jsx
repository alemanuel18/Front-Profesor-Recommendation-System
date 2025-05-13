// @ Front-Profesor-Recommendation-System
// @ File Name : Card_Estudiante.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Card_Estudiante
 * 
 * Este componente representa una tarjeta que muestra toda la información
 * académica relevante de un estudiante.
 * Características:
 * - Muestra información detallada del estudiante
 * - Diseño claro y organizado
 * - Validación de tipos de datos
 * - Presentación consistente de la información
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renderiza una tarjeta con información detallada del estudiante
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.id - ID único del estudiante
 * @param {string} props.Carne - Número de carnet del estudiante
 * @param {string} props.Name - Nombre completo del estudiante
 * @param {string} props.Carrera - Carrera que estudia
 * @param {string} props.Pensum - Plan de estudios actual
 * @param {string|number} props.Promedio_Ciclo_Anterior - Promedio del último ciclo
 * @param {string|number} props.Grado - Grado actual
 * @param {string} props.Carga_MAX - Límite de carga académica
 */
const Card_Estudiante = ({ 
    id,
    Carne,
    Name,
    Carrera,
    Pensum,
    Promedio_Ciclo_Anterior,
    Grado,
    Carga_MAX
}) => (
    // Contenedor principal con estilo de tarjeta
    <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
        {/* Lista de información del estudiante */}
        <div className="space-y-3">
            {/* Cada campo se muestra con su etiqueta en negrita */}
            <p><strong className="font-bold">Carnet: </strong>{Carne}</p>
            <p><strong className="font-bold">Estudiante: </strong>{Name}</p>
            <p><strong className="font-bold">Carrera: </strong>{Carrera}</p>
            <p><strong className="font-bold">Pensum: </strong>{Pensum}</p>
            <p><strong className="font-bold">Prom. ciclo anterior: </strong>{Promedio_Ciclo_Anterior}</p>
            <p><strong className="font-bold">Grado: </strong>{Grado}</p>
            <p><strong className="font-bold">Carga máxima: </strong>{Carga_MAX}</p>
        </div>
    </div>
);

// Validación estricta de propiedades
Card_Estudiante.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // ID puede ser string o número
    Carne: PropTypes.string.isRequired, // Carnet es requerido
    Name: PropTypes.string.isRequired, // Nombre es requerido
    Carrera: PropTypes.string.isRequired, // Carrera es requerida
    Pensum: PropTypes.string.isRequired, // Pensum es requerido
    Promedio_Ciclo_Anterior: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Promedio puede ser string o número
    Grado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Grado puede ser string o número
    Carga_MAX: PropTypes.string.isRequired // Carga máxima es requerida
};

export default Card_Estudiante;