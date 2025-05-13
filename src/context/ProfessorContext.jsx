// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Contexto de Profesores
 * 
 * Este archivo gestiona el estado global de los datos de profesores.
 * Proporciona:
 * - Acceso centralizado a la información de profesores
 * - Funciones para obtener y filtrar profesores
 * - Simulación de carga de datos (en producción sería una API)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto para datos de profesores
const ProfessorContext = createContext();

// ===== DATOS DE PRUEBA =====
// En producción, estos datos vendrían de una API
const professorsData = [
  { 
    id: 1, 
    name: 'Dr. Roberto García', 
    image: '/api/placeholder/200/200',
    exp: 'Doctor en Matemáticas Aplicadas',
    department: 'Facultad de Ingeniería',
    email: 'roberto.garcia@uvg.edu.gt',
    phone: '2222-1234',
    specialties: ['Cálculo', 'Álgebra Lineal', 'Ecuaciones Diferenciales'],
    courses: ['Cálculo 1', 'Álgebra Lineal 1'],
    rating: 4.8
  },
  { 
    id: 2, 
    name: 'Mtra. Laura Fernández', 
    image: '/api/placeholder/200/200',
    degree: 'Maestría en Estadística',
    department: 'Facultad de Ciencias',
    email: 'laura.fernandez@uvg.edu.gt',
    phone: '2222-5678',
    specialties: ['Probabilidad', 'Estadística Inferencial', 'Análisis de Datos'],
    courses: ['Estadística 1', 'Álgebra Lineal 1'],
    rating: 4.5
  },
  { 
    id: 3, 
    name: 'Ing. Carlos Mendoza', 
    image: '/api/placeholder/200/200',
    degree: 'Ingeniería en Sistemas con especialización en Matemáticas',
    department: 'Facultad de Ingeniería',
    email: 'carlos.mendoza@uvg.edu.gt',
    phone: '2222-9012',
    specialties: ['Cálculo', 'Álgebra', 'Geometría Analítica'],
    courses: ['Cálculo 1', 'Estadística 1'],
    rating: 4.7
  }
];

// ===== PROVEEDOR DEL CONTEXTO =====
export const ProfessorProvider = ({ children }) => {
  // Estados para manejar los datos y la carga
  const [professors, setProfessors] = useState(professorsData);
  const [loading, setLoading] = useState(true);

  // Efecto para simular la carga inicial de datos
  useEffect(() => {
    // En producción, aquí se haría una llamada a una API
    const fetchData = () => {
      setTimeout(() => {
        setProfessors(professorsData);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  /**
   * Obtiene un profesor específico por su ID
   * @param {string|number} id - ID del profesor a buscar
   * @returns {Object|null} - Datos del profesor o null si no se encuentra
   */
  const getProfessorById = (id) => {
    const numId = parseInt(id, 10);
    return professors.find(prof => prof.id === numId) || null;
  };

  // Valor del contexto que se proporcionará
  const value = {
    professors,       // Lista completa de profesores
    loading,         // Estado de carga
    getProfessorById // Función para buscar profesor por ID
  };

  return (
    <ProfessorContext.Provider value={value}>
      {children}
    </ProfessorContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de profesores
export const useProfessor = () => {
  const context = useContext(ProfessorContext);
  if (context === undefined) {
    throw new Error('useProfessor debe ser usado dentro de un ProfessorProvider');
  }
  return context;
};