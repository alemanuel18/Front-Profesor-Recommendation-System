// @ Front-Profesor-Recommendation-System
// @ File Name : Card_Estudiante.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el componente Card_Estudiante.
// Representa una tarjeta que muestra información detallada del estudiante.
// La información se recibe como propiedades y se renderiza en un diseño estilizado.

import React from 'react';
import PropTypes from 'prop-types';

const Card_Estudiante = ({ 
    id, // ID único del estudiante
    Carne, // Carnet del estudiante
    Name, // Nombre completo del estudiante
    Carrera, // Carrera del estudiante
    Pensum, // Pensum del estudiante
    Promedio_Ciclo_Anterior, // Promedio del ciclo anterior
    Grado, // Grado actual del estudiante
    Carga_MAX // Carga máxima permitida
}) => (
    <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
        <div className="space-y-3">
            {/* Renderiza cada propiedad del estudiante */}
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

// Validación de propiedades para garantizar que se pasen los datos correctos
Card_Estudiante.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Carne: PropTypes.string.isRequired,
    Name: PropTypes.string.isRequired,
    Carrera: PropTypes.string.isRequired,
    Pensum: PropTypes.string.isRequired,
    Promedio_Ciclo_Anterior: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Grado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Carga_MAX: PropTypes.string.isRequired
};

export default Card_Estudiante;