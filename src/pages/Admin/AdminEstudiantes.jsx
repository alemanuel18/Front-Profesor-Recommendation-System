// @ Front-Profesor-Recommendation-System
// @ File Name : AdminEstudiantes.jsx
// @ Date : 26/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente AdminEstudiantes
 * 
 * Esta página implementa la interfaz de administración de estudiantes.
 * Características principales:
 * - Lista todos los estudiantes registrados
 * - Permite acceder a detalles individuales
 * - Permite eliminar estudiantes
 * - Implementa control de acceso administrativo
 * - Adaptado al modelo Estudiante.py
 * - Funcionalidades de ordenamiento y conteo
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const AdminEstudiantes = () => {
  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== ESTADOS LOCALES =====
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== ESTADOS PARA ORDENAMIENTO =====
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');

  // ===== EFECTOS =====
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    } else {
      fetchStudents();
    }
  }, [isAdmin, navigate]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEstudiantes();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE ORDENAMIENTO =====

  /**
   * Ordena los estudiantes según el criterio seleccionado
   */
  const sortStudents = (studentsArray, criteria, order) => {
    return [...studentsArray].sort((a, b) => {
      let valueA, valueB;

      switch (criteria) {
        case 'nombre':
          valueA = (a.nombre || '').toLowerCase();
          valueB = (b.nombre || '').toLowerCase();
          break;
        case 'carnet':
          valueA = a.carnet || '';
          valueB = b.carnet || '';
          break;
        case 'carrera':
          valueA = (a.carrera || '').toLowerCase();
          valueB = (b.carrera || '').toLowerCase();
          break;
        case 'promedio':
          valueA = a.promedio || 0;
          valueB = b.promedio || 0;
          break;
        default:
          valueA = (a.nombre || '').toLowerCase();
          valueB = (b.nombre || '').toLowerCase();
      }

      if (criteria === 'promedio') {
        // Para números, comparación numérica
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        // Para strings, comparación alfabética
        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  /**
   * Maneja el cambio de criterio de ordenamiento
   */
  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      // Si es el mismo criterio, cambiar el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es diferente criterio, establecer ascendente por defecto
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  /**
   * Obtiene los estudiantes ordenados
   */
  const getSortedStudents = () => {
    return sortStudents(students, sortBy, sortOrder);
  };

  /**
   * Obtiene el ícono de ordenamiento para una columna
   */
  const getSortIcon = (criteria) => {
    if (sortBy !== criteria) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  // ===== FUNCIONES EXISTENTES =====

  /**
   * Maneja la navegación a los detalles de un estudiante
   */
  const handleStudentSelect = (student) => {
    const nombreEstudiante = typeof student === 'string' ? student : (student.nombre || student.name);
    console.log('🔍 Navegando a detalles del estudiante:', nombreEstudiante);

    navigate(`/admin/students/${nombreEstudiante}`, {
      state: {
        studentData: student
      }
    });
  };

  /**
   * Abre el modal de confirmación para eliminar estudiante
   */
  const handleDeleteClick = (student) => {
    console.log('🗑️ Estudiante seleccionado para eliminar:', student);

    const studentData = {
      ...student,
      nombre: student.nombre || student.name,
      name: student.name || student.nombre
    };

    console.log('📝 Datos del estudiante normalizados:', studentData);
    setStudentToDelete(studentData);
    setShowDeleteModal(true);
  };

  /**
   * Elimina un estudiante
   */
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    const carnetEstudiante = studentToDelete.carnet;

    console.log('🔍 Intentando eliminar estudiante:', carnetEstudiante);

    if (!carnetEstudiante) {
      console.error('❌ No se pudo obtener el carnet del estudiante');
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Error: No se pudo identificar el estudiante a eliminar.',
        confirmButtonText: 'Intentar de nuevo'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🌐 Enviando petición de eliminación para:', carnetEstudiante);
      const response = await apiService.deleteEstudiante(carnetEstudiante);

      // Verificar la respuesta de manera más flexible
      if (response && (response.success || response.status === 200 || response.status === 204)) {
        console.log('✅ Estudiante eliminado exitosamente');
        Swal.fire({
          icon: 'success',
          title: 'Estudiante eliminado',
          text: 'Estudiante eliminado exitosamente',
        });
        // Forzar actualización del estado
        setStudents(prev => prev.filter(s => s.carnet !== carnetEstudiante));
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } else {
        throw new Error(response?.message || 'Error al eliminar el estudiante');
      }
    } catch (error) {
      console.error('❌ Error eliminando estudiante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar estudiante',
        text: 'Error: No se pudo eliminar al estudiante a eliminar.',
        confirmButtonText: 'Intentar de nuevo'
      });
      alert(`Error al eliminar el estudiante: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDERIZADO CONDICIONAL =====
  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedStudents = getSortedStudents();

  // ===== RENDERIZADO PRINCIPAL =====
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 flex-1 w-full">
        <Header />

        <div className="p-8">
          {/* Título y contador */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-2">
                Administración de Estudiantes
              </h1>
              <p className="text-gray-600 text-sm">
                {students.length === 0 
                  ? 'No hay estudiantes registrados' 
                  : `Total de estudiantes: ${students.length}`
                }
              </p>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          {students.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Promedio General</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.length > 0 
                        ? (students.reduce((sum, student) => sum + (student.promedio || 0), 0) / students.length).toFixed(1) + '%'
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Carreras Únicas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(students.map(s => s.carrera).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Mejor Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.length > 0 
                        ? Math.max(...students.map(s => s.promedio || 0)).toFixed(1) + '%'
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay estudiantes */}
          {students && students.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-800">No hay estudiantes registrados en el sistema.</p>
            </div>
          )}

          {/* Tabla de estudiantes */}
          {students.length > 0 && (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="py-3 px-6">Imagen</th>
                    
                    {/* Nombre - Clickeable para ordenar */}
                    <th 
                      scope="col" 
                      className="py-3 px-6 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                      onClick={() => handleSortChange('nombre')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Nombre</span>
                        {getSortIcon('nombre')}
                      </div>
                    </th>

                    {/* Carnet - Clickeable para ordenar */}
                    <th 
                      scope="col" 
                      className="py-3 px-6 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                      onClick={() => handleSortChange('carnet')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Carnet</span>
                        {getSortIcon('carnet')}
                      </div>
                    </th>

                    {/* Carrera - Clickeable para ordenar */}
                    <th 
                      scope="col" 
                      className="py-3 px-6 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                      onClick={() => handleSortChange('carrera')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Carrera</span>
                        {getSortIcon('carrera')}
                      </div>
                    </th>

                    {/* Promedio - Clickeable para ordenar */}
                    <th 
                      scope="col" 
                      className="py-3 px-6 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                      onClick={() => handleSortChange('promedio')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Promedio</span>
                        {getSortIcon('promedio')}
                      </div>
                    </th>

                    <th scope="col" className="py-3 px-6">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedStudents.map((student, index) => {
                    return (
                      <tr key={student.carnet || index} className="bg-white border-b hover:bg-gray-50">
                        {/* Imagen */}
                        <td className="py-4 px-6">
                          <div className="relative">
                            <img
                              className="w-10 h-10 rounded-full object-cover bg-gray-200"
                              src="/images/student-avatar.jpg"
                              alt={`Avatar de ${student.nombre || 'Estudiante'}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.className = "w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center";
                                e.target.src = "";
                                e.target.outerHTML = `
                                  <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                    <span class="text-teal-800 font-medium text-sm">
                                      ${(student.nombre || 'E').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </td>

                        {/* Nombre */}
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {student.nombre || 'Nombre no disponible'}
                        </td>

                        {/* Carnet */}
                        <td className="py-4 px-6">
                          {student.carnet || 'N/A'}
                        </td>

                        {/* Carrera */}
                        <td className="py-4 px-6">
                          {student.carrera || 'N/A'}
                        </td>

                        {/* Promedio */}
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              student.promedio >= 80 ? 'text-green-600' : 
                              student.promedio >= 70 ? 'text-yellow-600' : 
                              student.promedio >= 60 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {student.promedio ? `${student.promedio.toFixed(1)}%` : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDeleteClick(student)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Eliminar estudiante"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Información de ordenamiento actual */}
          {students.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Ordenado por: <span className="font-medium text-teal-600">
                {sortBy === 'nombre' ? 'Nombre' : 
                 sortBy === 'carnet' ? 'Carnet' : 
                 sortBy === 'carrera' ? 'Carrera' : 'Promedio'}
              </span> 
              ({sortOrder === 'asc' ? 'Ascendente' : 'Descendente'})
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.083 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar al estudiante <strong>{studentToDelete?.nombre || studentToDelete?.name}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteStudent}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEstudiantes;