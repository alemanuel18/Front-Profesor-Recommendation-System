// @ Front-Profesor-Recommendation-System
// @ File Name : Materias.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
//

// Este archivo representa la página de lista de cursos disponibles para el estudiante.
// Permite al estudiante seleccionar un curso para asignarse.
// Incluye componentes como Sidebar y Header.

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const CourseList = () => {

  const { currentUser, isAdmin } = useAuth();

  const SidebarComponent = isAdmin() ? (
    <AdminSidebar />
  ) : (
    <Sidebar Name={studentData.name} />
  );
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Obtiene los datos del estudiante desde el contexto global
  const studentData = useStudent();

  // Lista de cursos disponibles (simulada)
  const courses = [
    { id: 1, name: 'Calculo 1' },
    { id: 2, name: 'Álgebra Lineal 1' },
    { id: 3, name: 'Estadística 1' }
  ];

  // Función para manejar la selección de un curso
  const handleCourseSelect = (course) => {
    navigate(`/cursos/${course.id}`, {
      state: { courseName: course.name } // Pasa el nombre del curso como estado de navegación
    });
  };

  return (
    <div className="flex">
      {/* Sidebar muestra el nombre del estudiante */}
      {SidebarComponent}
      <div className="ml-64 flex-1 w-full">
        {/* Header muestra el encabezado de la página */}
        <Header />
        <div className="p-8">
          {/* Título principal de la página */}
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {/* Botones para cada curso disponible */}
          {courses.map((course) => (
            <button
              key={course.id} // ID único del curso
              onClick={() => handleCourseSelect(course)} // Maneja la selección del curso
              className="block bg-gray-200 p-4 mb-4 w-full text-left rounded hover:bg-gray-300 transition-colors"
            >
              {course.name} {/* Nombre del curso */}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CourseList;