// @ Front-Profesor-Recommendation-System
// @ File Name : AdminCourses.jsx
// @ Date : 26/05/2025
// @ Author : Marcelo Detlefsen

/**
 * Componente AdminCourses
 * 
 * Esta página implementa la interfaz de administración de cursos.
 * Características principales:
 * - Lista todos los cursos registrados
 * - Permite acceder a detalles individuales
 * - Permite eliminar cursos
 * - Permite agregar nuevos cursos
 * - Implementa control de acceso administrativo
 * - Adaptado al modelo Curso.py
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

const AdminCourses = () => {
  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // ===== ESTADOS LOCALES =====
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    departamento: '',
    creditos: 0
  });
  const [formErrors, setFormErrors] = useState({});

  // ===== EFECTOS =====
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    
    fetchCourses();
  }, [isAdmin, navigate]);

  // ===== FUNCIONES =====

  /**
   * Obtiene todos los cursos desde la API
   */
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCursos();
      
      if (response && response.success) {
        setCourses(response.data || []);
      } else {
        throw new Error('Error al obtener los cursos');
      }
    } catch (err) {
      console.error('Error obteniendo cursos:', err);
      setError(`Error al cargar los cursos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la navegación a los detalles de un curso
   */
  const handleCourseSelect = (course) => {
    navigate(`/admin/courses/${course.codigo}`, {
      state: {
        courseData: course
      }
    });
  };

  /**
   * Abre el modal de confirmación para eliminar curso
   */
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  /**
   * Elimina un curso
   */
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await apiService.deleteCurso(courseToDelete.codigo);
      
      if (response && response.success) {
        await fetchCourses(); // Recargar lista
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } else {
        throw new Error('Error al eliminar el curso');
      }
    } catch (error) {
      console.error('Error eliminando curso:', error);
      setError(`Error al eliminar el curso: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja los cambios en el formulario
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.codigo.trim()) {
      errors.codigo = 'El código es requerido';
    }

    if (!formData.departamento.trim()) {
      errors.departamento = 'El departamento es requerido';
    }

    if (formData.creditos < 0) {
      errors.creditos = 'Los créditos no pueden ser negativos';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja el envío del formulario para agregar curso
   */
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createCurso(formData);
      
      if (response && response.success) {
        await fetchCourses(); // Recargar lista
        setShowAddModal(false);
        resetForm();
      } else {
        throw new Error('Error al crear el curso');
      }
    } catch (error) {
      console.error('Error creando curso:', error);
      setError(`Error al crear el curso: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      nombre: '',
      codigo: '',
      departamento: '',
      creditos: 0
    });
    setFormErrors({});
  };

  /**
   * Cierra el modal de agregar curso
   */
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
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
          {/* Título y botón de agregar */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2">
              Administración de Cursos
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar Curso</span>
            </button>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Tabla de cursos */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="py-3 px-6">Código</th>
                  <th scope="col" className="py-3 px-6">Nombre</th>
                  <th scope="col" className="py-3 px-6">Departamento</th>
                  <th scope="col" className="py-3 px-6">Créditos</th>
                  <th scope="col" className="py-3 px-6">Acciones</th>
                </tr>
              </thead>
              
              <tbody>
                {courses && courses.length > 0 ? (
                  courses.map((course, index) => (
                    <tr key={course.codigo || index} className="bg-white border-b hover:bg-gray-50">
                      {/* Código */}
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {course.codigo || 'N/A'}
                      </td>

                      {/* Nombre */}
                      <td className="py-4 px-6">
                        {course.nombre || 'Nombre no disponible'}
                      </td>

                      {/* Departamento */}
                      <td className="py-4 px-6">
                        {course.departamento || 'N/A'}
                      </td>
                      
                      {/* Créditos */}
                      <td className="py-4 px-6">
                        {course.creditos || 0}
                      </td>
                      
                      {/* Acciones */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleCourseSelect(course)}
                            className="font-medium text-teal-600 hover:underline"
                          >
                            Ver detalles
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar curso"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                      No hay cursos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar curso */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Encabezado del modal */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Agregar Nuevo Curso</h3>
                <button
                  onClick={handleCloseAddModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmitCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Curso *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese el nombre del curso"
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                    )}
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código del Curso *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.codigo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: MAT101"
                    />
                    {formErrors.codigo && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.codigo}</p>
                    )}
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento *
                    </label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => handleInputChange('departamento', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.departamento ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Matemáticas"
                    />
                    {formErrors.departamento && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.departamento}</p>
                    )}
                  </div>

                  {/* Créditos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Créditos *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.creditos}
                      onChange={(e) => handleInputChange('creditos', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.creditos ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.creditos && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.creditos}</p>
                    )}
                  </div>
                </div>

                {/* Botones del formulario */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                ¿Estás seguro de que deseas eliminar el curso <strong>{courseToDelete?.nombre}</strong> ({courseToDelete?.codigo})?
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
                  onClick={handleDeleteCourse}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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

export default AdminCourses;