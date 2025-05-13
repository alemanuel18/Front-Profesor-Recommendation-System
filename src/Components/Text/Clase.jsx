// @ Front-Profesor-Recommendation-System
// @ File Name : Clase.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente Clase
 * 
 * Este componente representa el encabezado de una página de curso.
 * Características:
 * - Muestra el nombre del curso seleccionado
 * - Utiliza estilos consistentes con la UI de la aplicación
 * - Implementa validación de propiedades
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.id - Identificador único del curso
 * @param {string} props.Class - Nombre del curso a mostrar
 */

import React from 'react';
import PropTypes from 'prop-types';

const Clase = ({ id, Class }) => (
    // Encabezado estilizado con Tailwind CSS
    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
        Asignación de Cursos - {Class}
    </h1>
);

// Validación de propiedades usando PropTypes
Clase.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,    // El ID puede ser una cadena
        PropTypes.number     // o un número
    ]),
    Class: PropTypes.string.isRequired // El nombre del curso es obligatorio
};

export default Clase;