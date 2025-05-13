// @ Front-Profesor-Recommendation-System
// @ File Name : Materias.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente CourseList (Lista de Cursos)
 * 
 * Este componente representa la página que muestra la lista de cursos disponibles para asignación.
 * Características principales:
 * - Muestra una lista de cursos disponibles para el estudiante
 * - Maneja la navegación a la selección de profesores para cada curso
 * - Implementa interfaz diferenciada para estudiantes y administradores
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const CourseList = () => {
  // ===== HOOKS Y CONTEXTO =====
  const { currentUser, isAdmin } = useAuth(); // Autenticación y rol del usuario
  const navigate = useNavigate(); // Hook para navegación
  const studentData = useStudent(); // Datos del estudiante

  // Determina qué barra lateral mostrar según el rol del usuario
  const SidebarComponent = isAdmin() ? (
    <AdminSidebar />
  ) : (
    <Sidebar Name={studentData.name} />
  );

  // Lista de cursos disponibles (simulada - en producción vendría de una API)
  const courses = [
    { id: 1, name: 'Calculo 1' },
    { id: 2, name: 'Álgebra Lineal 1' },
    { id: 3, name: 'Estadística 1' }
  ];

  /**
   * Maneja la selección de un curso
   * Navega a la página de selección de profesores para el curso elegido
   * @param {Object} course - Objeto con la información del curso seleccionado
   */
  const handleCourseSelect = (course) => {
    navigate(`/cursos/${course.id}`, {
      state: { courseName: course.name }
    });
  };

  // ===== RENDERIZADO DEL COMPONENTE =====
  return (
    <div className="flex">
      {/* Barra lateral (Sidebar) según el rol del usuario */}
      {SidebarComponent}
      
      <div className="ml-64 flex-1 w-full">
        {/* Encabezado de la página */}
        <Header />
        
        <div className="p-8">
          {/* Título de la sección */}
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {/* Lista de cursos disponibles */}
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              className="block bg-gray-200 p-4 mb-4 w-full text-left rounded hover:bg-gray-300 transition-colors"
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;