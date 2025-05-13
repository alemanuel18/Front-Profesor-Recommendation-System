// @ Front-Profesor-Recommendation-System
// @ File Name : StudentContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Contexto de Estudiante
 * 
 * Este archivo gestiona el estado global de los datos del estudiante actual.
 * Proporciona:
 * - Acceso centralizado a la información del estudiante
 * - Datos académicos relevantes para la asignación de cursos
 * - Información sobre límites y restricciones de asignación
 */

import React, { createContext, useContext } from 'react';

// Crear el contexto para los datos del estudiante
const StudentContext = createContext();

// ===== DATOS DE PRUEBA =====
// En producción, estos datos vendrían de una API o sistema académico
const studentData = {
  id: "1",                    // ID único del estudiante en el sistema
  carne: "2023-12345",       // Número de carnet institucional
  name: "JEREZ MELGAR, ALEJANDRO MANUEL", // Nombre completo
  carrera: "7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN", 
  pensum: "RENOVACIÓN CURRICULAR 2022", // Plan de estudios actual
  promedioCicloAnterior: "90",          // Promedio del último ciclo cursado
  grado: "2",                           // Año o nivel académico actual
  cargaMaxima: "Puede asignarse un máximo de 8 cursos" // Restricción de carga académica
};

/**
 * Proveedor del contexto de estudiante
 * Hace disponible la información del estudiante para toda la aplicación
 */
export const StudentProvider = ({ children }) => {
  return (
    <StudentContext.Provider value={studentData}>
      {children}
    </StudentContext.Provider>
  );
};

/**
 * Hook personalizado para acceder a los datos del estudiante
 * @throws {Error} Si se usa fuera del StudentProvider
 * @returns {Object} Datos completos del estudiante
 */
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context;
};