// @ Front-Profesor-Recommendation-System
// @ File Name : Seleccion_Profesores.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página de selección de profesores para un curso específico.
// Muestra una lista de profesores disponibles para el curso seleccionado.
// Incluye componentes como Sidebar, Header, Clase y Card_Profesor.

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Clase from '../Components/Text/Clase';
import Card_Profesor from '../Components/Cards/Card_Profesor';
import { useStudent } from '../context/StudentContext';

const TeacherSelection = () => {
  // Obtiene el parámetro de la URL (cursoId)
  const { cursoId } = useParams();

  // Obtiene el estado de navegación que contiene el nombre del curso
  const location = useLocation();
  const courseName = location.state?.courseName || "Curso no especificado";

  // Obtiene datos del estudiante desde el contexto global
  const studentData = useStudent();

  // Lista de profesores disponibles para el curso (simulada)
  const teachers = [
    { id: 1, name: 'Dr. Roberto García' },
    { id: 2, name: 'Mtra. Laura Fernández' },
    { id: 3, name: 'Ing. Carlos Mendoza' }
  ];

  return (
    <div className="flex">
      {/* Sidebar muestra el nombre del estudiante */}
      <Sidebar Name={studentData.name} />
      <div className="ml-64 flex-1 w-full">
        {/* Header muestra el encabezado de la página */}
        <Header />
        <div className="p-8">
          {/* Componente Clase muestra el nombre del curso */}
          <Clase 
            id={cursoId} // ID del curso
            Class={courseName} // Nombre del curso
          />

          {/* Lista de tarjetas de profesores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card_Profesor
                key={teacher.id} // ID único del profesor
                id={teacher.id} // ID del profesor
                Name={teacher.name} // Nombre del profesor
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSelection;