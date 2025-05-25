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
 * - Obtiene datos reales del usuario autenticado
 * - Presentación consistente de la información
 */

import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';

const Card_Estudiante = () => {
    const { 
        carne,
        name,
        carrera,
        pensum,
        promedioCicloAnterior,
        grado,
        cargaMaxima,
        loading,
        error,
        dataSource
    } = useStudent();

    const { currentUser } = useAuth();

    // Mostrar loading mientras se cargan los datos
    if (loading) {
        return (
            <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                </div>
            </div>
        );
    }

    // Mostrar error si hay algún problema
    if (error && dataSource !== 'mock') {
        return (
            <div className="w-full max-w-4xl p-8 bg-red-50 border border-red-200 rounded-lg mb-6">
                <div className="text-red-700">
                    <p className="font-bold">Error al cargar datos del estudiante:</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
            {/* Indicador de fuente de datos */}
            {dataSource === 'mock' && (
                <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                    ⚠️ Mostrando datos de demostración (API no disponible)
                </div>
            )}
            
            <div className="space-y-3">
                <p><strong className="font-bold">Carnet: </strong>{carne || currentUser?.carnet || 'No disponible'}</p>
                <p><strong className="font-bold">Estudiante: </strong>{name || currentUser?.name || 'No disponible'}</p>
                <p><strong className="font-bold">Carrera: </strong>{carrera || 'No disponible'}</p>
                <p><strong className="font-bold">Pensum: </strong>{pensum || 'No disponible'}</p>
                <p><strong className="font-bold">Prom. ciclo anterior: </strong>{promedioCicloAnterior || 'No disponible'}</p>
                <p><strong className="font-bold">Grado: </strong>{grado || 'No disponible'}</p>
                <p><strong className="font-bold">Carga máxima: </strong>{cargaMaxima || 'No disponible'}</p>
            </div>

            {/* Información adicional sobre la fuente de datos */}
            <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                    Fuente de datos: {dataSource === 'api' ? 'API Real' : dataSource === 'mock' ? 'Datos de demostración' : 'Cargando...'}
                </p>
            </div>
        </div>
    );
};

export default Card_Estudiante;