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

  // ===== FUNCIONES =====

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

  // ===== RENDERIZADO PRINCIPAL =====
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 flex-1 w-full">
        <Header />

        <div className="p-8">
          {/* Título */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2">
              Administración de Estudiantes
            </h1>
          </div>

          {/* Debug: Mostrar cantidad de estudiantes */}
          {students && students.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-800">No hay estudiantes registrados en el sistema.</p>
            </div>
          )}

          {/* Tabla de estudiantes */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="py-3 px-6">Imagen</th>
                  <th scope="col" className="py-3 px-6">Nombre</th>
                  <th scope="col" className="py-3 px-6">Carnet</th>
                  <th scope="col" className="py-3 px-6">Carrera</th>
                  <th scope="col" className="py-3 px-6">Promedio</th>
                  <th scope="col" className="py-3 px-6">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {students && students.length > 0 ? (
                  students.map((student, index) => {
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
                            <span className="font-medium">
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
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 px-6 text-center text-gray-500">
                      No hay estudiantes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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