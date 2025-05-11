import React, { createContext, useContext } from 'react';

// Crear el contexto
const StudentContext = createContext();

// Datos del estudiante
const studentData = {
  id: "1",
  carne: "2023-12345",
  name: "JEREZ MELGAR, ALEJANDRO MANUEL",
  carrera: "7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN",
  pensum: "RENOVACIÓN CURRICULAR 2022",
  promedioCicloAnterior: "90",
  grado: "2",
  cargaMaxima: "Puede asignarse un máximo de 8 cursos"
};

// Proveedor del Contexto
export const StudentProvider = ({ children }) => {
  return (
    <StudentContext.Provider value={studentData}>
      {children}
    </StudentContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context;
};