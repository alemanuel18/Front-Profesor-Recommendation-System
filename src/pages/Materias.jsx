// @ Front-Profesor-Recommendation-System
// @ File Name : Materias.jsx
// @ Date : 21/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente CourseList (Lista de Cursos)
 * 
 * Este componente representa la página que muestra la lista de cursos disponibles para asignación.
 * Actualizado para conectarse con la API del backend.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import apiService from '../services/apiService';

const CourseList = () => {
  // ===== HOOKS Y CONTEXTO =====
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const studentData = useStudent();
  
  // ===== ESTADOS =====
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== EFECTOS =====
  useEffect(() => {
    fetchCourses();
  }, []);

  // ===== FUNCIONES =====
  
  /**
   * Obtiene la lista de cursos desde la API
   */
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar obtener cursos desde la API
      // Como no veo un endpoint específico para cursos en tu API, 
      // usaré datos mock por ahora
      const mockCourses = await getMockCourses();
      setCourses(mockCourses);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
      // Cargar datos mock en caso de error
      setCourses(await getMockCourses());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Datos mock de cursos (puedes reemplazar esto con una llamada real a la API)
   */
  const getMockCourses = async () => {
    return [
      {
        id: 1,
        codigo: 'MAT101',
        name: 'Cálculo 1',
        description: 'Introducción al cálculo diferencial e integral',
        credits: 4,
        prerequisites: [],
        department: 'Matemáticas'
      },
      {
        id: 2,
        codigo: 'MAT102',
        name: 'Álgebra Lineal 1',
        description: 'Conceptos fundamentales de álgebra lineal',
        credits: 4,
        prerequisites: [],
        department: 'Matemáticas'
      },
      {
        id: 3,
        codigo: 'EST101',
        name: 'Estadística 1',
        description: 'Fundamentos de estadística descriptiva e inferencial',
        credits: 3,
        prerequisites: [],
        department: 'Estadística'
      },
      {
        id: 4,
        codigo: 'MAT201',
        name: 'Cálculo 2',
        description: 'Cálculo multivariable y series',
        credits: 4,
        prerequisites: ['MAT101'],
        department: 'Matemáticas'
      },
      {
        id: 5,
        codigo: 'CC101',
        name: 'Programación 1',
        description: 'Introducción a la programación',
        credits: 4,
        prerequisites: [],
        department: 'Ciencias de la Computación'
      }
    ];
  };

  /**
   * Maneja la selección de un curso
   * Navega a la página de selección de profesores para el curso elegido
   * @param {Object} course - Objeto con la información del curso seleccionado
   */
  const handleCourseSelect = (course) => {
    navigate(`/cursos/${course.id}`, {
      state: { 
        courseName: course.name,
        courseCode: course.codigo,
        courseData: course
      }
    });
  };

  // Determina qué barra lateral mostrar según el rol del usuario
  const SidebarComponent = isAdmin() ? (
    <AdminSidebar />
  ) : (
    <Sidebar Name={studentData.name} />
  );

  // ===== RENDERIZADO CONDICIONAL =====
  if (loading) {
    return (
      <div className="flex">
        {SidebarComponent}
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        {SidebarComponent}
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="p-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDERIZADO DEL COMPONENTE =====
  return (
    <div className="flex">
      {/* Barra lateral según el rol del usuario */}
      {SidebarComponent}
      
      <div className="ml-64 flex-1 w-full">
        {/* Encabezado de la página */}
        <Header />
        
        <div className="p-8">
          {/* Título de la sección */}
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {/* Información del estudiante */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Selecciona un curso para ver las recomendaciones de profesores personalizadas para ti.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de cursos disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCourseSelect(course)}
              >
                <div className="p-6">
                  {/* Código y nombre del curso */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {course.codigo}
                    </span>
                    <span className="text-sm text-gray-500">{course.credits} créditos</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  
                  {/* Departamento */}
                  <div className="flex items-center mb-3">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm text-gray-500">{course.department}</span>
                  </div>
                  
                  {/* Prerrequisitos */}
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Prerrequisitos:</span>
                      <div className="flex flex-wrap mt-1">
                        {course.prerequisites.map((prereq, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-1">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Botón de acción */}
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium">
                    Ver Profesores Recomendados
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay cursos */}
          {courses.length === 0 && !loading && (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos disponibles</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron cursos disponibles para asignación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;