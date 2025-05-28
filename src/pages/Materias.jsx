// @ Front-Profesor-Recommendation-System
// @ File Name : Materias.jsx
// @ Date : 25/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente CourseList (Lista de Cursos)
 * 
 * Este componente representa la página que muestra la lista de cursos disponibles para asignación.
 * Integrado completamente con la API del backend.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Header from '../Components/Header';
import TimesCourseModal from '../Components/TimesCourseModal';
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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showTimesModal, setShowTimesModal] = useState(false);
  const [filters, setFilters] = useState({
    departamento: '',
    searchTerm: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  // ===== EFECTOS =====
  useEffect(() => {
    fetchCourses();
  }, [filters.departamento]);

  useEffect(() => {
    // Refrescar cursos cada 30 segundos para mantener datos actualizados
    const interval = setInterval(() => {
      if (!loading) {
        refreshCourses();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading]);

  // ===== FUNCIONES =====
  
  /**
   * Obtiene la lista de cursos desde la API
   */
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Obteniendo cursos desde la API...');
      const response = await apiService.getCursos(filters.departamento || null);
      
      if (response.success) {
        console.log(`✅ ${response.data.length} cursos obtenidos exitosamente`);
        setCourses(response.data);
      } else {
        throw new Error(response.message || 'Error al obtener cursos');
      }
      
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      setError(err.message);
      
      // Intentar cargar datos mock como fallback
      try {
        console.log('🔄 Intentando cargar datos mock como fallback...');
        const mockCourses = await getMockCourses();
        setCourses(mockCourses);
        setError(prevError => `${prevError} (Mostrando datos de ejemplo)`);
      } catch (mockError) {
        console.error('❌ Error loading mock data:', mockError);
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresca los cursos sin mostrar loading completo
   */
  const refreshCourses = async () => {
    setRefreshing(true);
    
    try {
      const response = await apiService.getCursos(filters.departamento || null);
      
      if (response.success) {
        setCourses(response.data);
        // Limpiar error si la recarga fue exitosa
        if (error) setError(null);
      }
    } catch (err) {
      console.error('Error refreshing courses:', err);
      // No mostrar error en refresh silencioso
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Función auxiliar para navegar al curso
   */
  const navigateToCourse = (course) => {
    navigate(`/cursos/${course.codigo}`, {
      state: { 
        courseName: course.nombre,
        courseCode: course.codigo,
        courseData: course
      }
    });
  };

  /**
   * Obtiene una lista única de departamentos para el filtro
   */
  const getDepartamentos = () => {
    const departamentos = [...new Set(courses.map(course => course.departamento))];
    return departamentos.filter(Boolean).sort();
  };

  /**
   * Filtra los cursos según los criterios de búsqueda
   */
  const getFilteredCourses = () => {
    let filtered = courses;

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.nombre?.toLowerCase().includes(searchLower) ||
        course.codigo?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  /**
   * Maneja los cambios en los filtros
   */
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setFilters({
      departamento: '',
      searchTerm: ''
    });
  };

  /**
   * Maneja la selección de un curso
   * Navega a la página de selección de profesores para el curso elegido
   */
  const handleCourseSelect = async (course) => {
    try {
      // Opcional: Obtener información adicional del curso antes de navegar
      console.log(`📚 Seleccionado curso: ${course.codigo} - ${course.nombre}`);

      // Establecer el curso seleccionado y mostrar el modal
      setSelectedCourse(course);
      setShowTimesModal(true);
    } catch (err) {
      console.error('Error al seleccionar curso:', err);
    }
  };

  /**
   * Maneja la confirmación del número de veces cursado
   */
  const handleTimesConfirmed = async (times) => {
    setShowTimesModal(false);
    
    try {
      // Actualizar el número de veces que ha cursado el curso
      await apiService.updateEstudiante(currentUser.carnet, {
        veces_curso: times
      });
      
      // Ahora sí navegar al curso
      navigateToCourse(selectedCourse);
    } catch (error) {
      console.error('Error al actualizar veces_curso:', error);
      // Navegar de todas formas, mostrando error
      alert('No se pudo guardar el número de veces cursado, pero puedes continuar.');
      navigateToCourse(selectedCourse);
    }
  };

  /**
   * Obtiene el número de profesores de un curso (información adicional)
   */
  const getCourseStats = async (courseCode) => {
    try {
      const profesoresResponse = await apiService.getProfesoresPorCurso(courseCode);
      return {
        profesores: profesoresResponse.data?.length || 0
      };
    } catch {
      return { profesores: 0 };
    }
  };

  // Determina qué barra lateral mostrar según el rol del usuario
  const SidebarComponent = isAdmin() ? (
    <AdminSidebar />
  ) : (
    <Sidebar Name={studentData.name} />
  );

  // Obtener cursos filtrados
  const filteredCourses = getFilteredCourses();

  // ===== RENDERIZADO CONDICIONAL =====
  if (loading) {
    return (
      <div className="flex">
        {SidebarComponent}
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando cursos...</p>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2">
              Asignación de Cursos
            </h1>
            
            {/* Botón de refrescar */}
            <button
              onClick={refreshCourses}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:opacity-50"
            >
              <svg 
                className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <strong className="font-bold">Advertencia:</strong> {error}
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* Filtros de búsqueda */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Búsqueda</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda por texto */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar curso
                </label>
                <input
                  type="text"
                  id="search"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  placeholder="Nombre, código o descripción..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Filtro por departamento */}
              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  id="departamento"
                  value={filters.departamento}
                  onChange={(e) => handleFilterChange('departamento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Todos los departamentos</option>
                  {getDepartamentos().map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>

            {/* Estadísticas de resultados */}
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredCourses.length} de {courses.length} cursos
              {filters.departamento && ` en ${filters.departamento}`}
              {filters.searchTerm && ` que coinciden con "${filters.searchTerm}"`}
            </div>
          </div>

          {/* Lista de cursos disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.codigo}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleCourseSelect(course)}
              >
                <div className="p-6">
                  {/* Código y créditos del curso */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {course.codigo}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.creditos || 0} créditos
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.nombre}
                  </h3>
                  
                  {/* Departamento */}
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm text-gray-500">{course.departamento}</span>
                  </div>
                  
                  {/* Información adicional */}
                  {course.fecha_registro && (
                    <div className="flex items-center mb-4">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-500">
                        Registrado: {new Date(course.fecha_registro).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {/* Botón de acción */}
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Ver Profesores Recomendados
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay cursos */}
          {filteredCourses.length === 0 && !loading && (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {courses.length === 0 ? 'No hay cursos disponibles' : 'No se encontraron cursos'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {courses.length === 0 
                  ? 'No se encontraron cursos disponibles para asignación.'
                  : 'Intenta ajustar los filtros de búsqueda.'
                }
              </p>
              {courses.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de número de veces cursado */}
      <TimesCourseModal
        isOpen={showTimesModal}
        onClose={() => setShowTimesModal(false)}
        onConfirm={handleTimesConfirmed}
        course={selectedCourse}
      />
    </div>
  );
};

export default CourseList;