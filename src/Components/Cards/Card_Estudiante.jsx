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
import { useStudent } from '../../context/StudentContext';

const Card_Estudiante = () => {
    const { 
        carne,
        name,
        carrera,
        pensum,
        promedioCicloAnterior,
        grado,
        cargaMaxima
    } = useStudent();

    return (
        <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
            <div className="space-y-3">
                <p><strong className="font-bold">Carnet: </strong>{carne}</p>
                <p><strong className="font-bold">Estudiante: </strong>{name}</p>
                <p><strong className="font-bold">Carrera: </strong>{carrera}</p>
                <p><strong className="font-bold">Pensum: </strong>{pensum}</p>
                <p><strong className="font-bold">Prom. ciclo anterior: </strong>{promedioCicloAnterior}</p>
                <p><strong className="font-bold">Grado: </strong>{grado}</p>
                <p><strong className="font-bold">Carga máxima: </strong>{cargaMaxima}</p>
            </div>
        </div>
    );
};

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