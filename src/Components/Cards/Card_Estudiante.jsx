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
 * - Muestra información del usuario autenticado
 * - Obtiene datos adicionales de la API cuando está disponible
 * - Diseño claro y organizado
 * - No muestra datos de demostración, solo datos reales
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

    // Función para mostrar valor o indicar que no está disponible
    const displayValue = (value, fallback = 'No disponible') => {
        return value || fallback;
    };

    return (
        <div className="w-full max-w-4xl p-8 bg-gray-100 border border-gray-200 rounded-lg mb-6">
            {/* Indicador cuando la API no está disponible */}
            {dataSource === 'mock' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>
                            API no disponible. Mostrando información básica del usuario.
                        </span>
                    </div>
                </div>
            )}

            {/* Mostrar error si hay algún problema crítico */}
            {error && dataSource !== 'mock' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>Error: {error}</span>
                    </div>
                </div>
            )}
            
            <div className="space-y-3">
                <p>
                    <strong className="font-bold">Carnet: </strong>
                    {displayValue(carne || currentUser?.carnet)}
                </p>
                
                <p>
                    <strong className="font-bold">Estudiante: </strong>
                    {displayValue(name || currentUser?.name)}
                </p>
                
                <p>
                    <strong className="font-bold">Carrera: </strong>
                    {displayValue(carrera || currentUser?.carrera)}
                </p>
                
                <p>
                    <strong className="font-bold">Pensum: </strong>
                    {displayValue(pensum)}
                </p>
                
                <p>
                    <strong className="font-bold">Prom. ciclo anterior: </strong>
                    {displayValue(promedioCicloAnterior)}
                </p>
                
                <p>
                    <strong className="font-bold">Grado: </strong>
                    {displayValue(grado)}
                </p>
                
                <p>
                    <strong className="font-bold">Carga máxima: </strong>
                    {displayValue(cargaMaxima)}
                </p>
            </div>

            {/* Información sobre la fuente de datos */}
            <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                    {dataSource === 'api' 
                        ? '✅ Datos obtenidos de la API' 
                        : dataSource === 'mock' 
                        ? '⚠️ API no disponible - Datos básicos del usuario'
                        : 'Cargando datos...'
                    }
                </p>
            </div>
        </div>
    );
};

export default Card_Estudiante;