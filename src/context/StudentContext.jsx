// @ Front-Profesor-Recommendation-System
// @ File Name : StudentContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo define el contexto global para los datos del estudiante.
// Proporciona un proveedor y un hook personalizado para acceder a los datos del estudiante en toda la aplicación.

import React, { createContext, useContext } from 'react';

// Crear el contexto para los datos del estudiante
const StudentContext = createContext();

// Datos del estudiante (simulados)
const studentData = {
  id: "1", // ID único del estudiante
  carne: "2023-12345", // Carnet del estudiante
  name: "JEREZ MELGAR, ALEJANDRO MANUEL", // Nombre completo del estudiante
  carrera: "7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN", // Carrera del estudiante
  pensum: "RENOVACIÓN CURRICULAR 2022", // Pensum del estudiante
  promedioCicloAnterior: "90", // Promedio del ciclo anterior
  grado: "2", // Grado actual del estudiante
  cargaMaxima: "Puede asignarse un máximo de 8 cursos" // Carga máxima permitida
};

// Proveedor del contexto para envolver la aplicación
export const StudentProvider = ({ children }) => {
  return (
    <StudentContext.Provider value={studentData}>
      {children} {/* Renderiza los componentes hijos */}
    </StudentContext.Provider>
  );
};

// Hook personalizado para acceder al contexto del estudiante
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context; // Retorna los datos del estudiante
};