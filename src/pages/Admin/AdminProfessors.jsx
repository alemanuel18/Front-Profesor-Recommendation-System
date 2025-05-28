// @ Front-Profesor-Recommendation-System
// @ File Name : AdminProfessors.jsx
// @ Date : 26/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente AdminProfessors
 * 
 * Esta página implementa la interfaz de administración de profesores.
 * Características principales:
 * - Lista todos los profesores registrados
 * - Permite acceder a detalles individuales
 * - Permite eliminar profesores
 * - Permite agregar nuevos profesores
 * - Implementa control de acceso administrativo
 * - Adaptado al modelo Profesor.py
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import { useProfessor } from '../../context/ProfessorContext';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AdminProfessors = () => {
  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate();
  const { professors, loading, fetchProfessors } = useProfessor();
  const { isAdmin } = useAuth();

  // ===== ESTADOS LOCALES =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    estilo_enseñanza: '',
    estilo_clase: '',
    años_experiencia: 0,
    evaluacion_docente: 0,
    porcentaje_aprobados: 0,
    disponibilidad: 0
  });
  const [formErrors, setFormErrors] = useState({});

  // ===== EFECTOS =====
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Debug: Mostrar datos en consola para verificar estructura
  useEffect(() => {
    if (professors && professors.length > 0) {
      console.log('📊 Datos de profesores:', professors);
      console.log('📋 Primer profesor:', professors[0]);
    }
  }, [professors]);

  // ===== FUNCIONES =====

  /**
   * Maneja la navegación a los detalles de un profesor
   */
  const handleProfessorSelect = (professor) => {
    // Asegurarse de obtener el nombre correctamente
    const nombreProfesor = typeof professor === 'string' 
        ? professor 
        : (professor.nombre || professor.name);
    
    console.log('Nombre del profesor a buscar:', nombreProfesor);
    
    // Verificar que el nombre no esté vacío
    if (!nombreProfesor) {
        console.error('Nombre del profesor no válido');
        return;
    }

    // NO hacer encodeURIComponent aquí - apiService ya lo hace
    // Pasar el nombre sin encodear a apiService
    apiService.getProfesor(nombreProfesor) // ✅ Nombre sin encodear
        .then(profesorData => {
            // Verificar que se recibieron datos
            if (!profesorData) {
                throw new Error('No se recibieron datos del profesor');
            }
            
            // Obtener cursos del profesor (también sin encodear)
            return apiService.getCursosProfesor(nombreProfesor) // ✅ Nombre sin encodear
                .then(cursosResponse => {
                    // Solo para la navegación hacer el encoding UNA vez
                    const nombreCodificado = encodeURIComponent(nombreProfesor);
                    navigate(`/admin/professors/${nombreCodificado}`, {
                        state: {
                            profesorData: profesorData,
                            cursos: cursosResponse?.data?.cursos || []
                        }
                    });
                });
        })
        .catch(error => {
            console.error('Error obteniendo datos del profesor:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información del profesor',
                confirmButtonText: 'OK'
            });
        });
  };

  /**
   * Abre el modal de confirmación para eliminar profesor
   */
  const handleDeleteClick = (professor) => {
    console.log('🗑️ Profesor seleccionado para eliminar:', professor);

    // Asegurar compatibilidad con ambos formatos de datos
    const professorData = {
      ...professor,
      nombre: professor.nombre || professor.name,
      name: professor.name || professor.nombre
    };

    console.log('📝 Datos del profesor normalizados:', professorData);
    setProfessorToDelete(professorData);
    setShowDeleteModal(true);
  };

  /**
   * Elimina un profesor
   */
  const handleDeleteProfessor = async () => {
    if (!professorToDelete) return;

    // Obtener el nombre del profesor de manera segura
    const nombreProfesor = professorToDelete.nombre || professorToDelete.name;

    console.log('🔍 Intentando eliminar profesor:', nombreProfesor);

    if (!nombreProfesor) {
      console.error('❌ No se pudo obtener el nombre del profesor');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error: No se pudo identificar al profesor a eliminar.',
        confirmButtonText: 'Intentar de nuevo'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🌐 Enviando petición de eliminación para:', nombreProfesor);
      
      // ✅ Pasar el nombre SIN encodear - apiService ya lo hace
      const response = await apiService.deleteProfesor(nombreProfesor);

      if (response && response.success) {
        console.log('✅ Profesor eliminado exitosamente');
        Swal.fire({
          icon: 'success',
          title: 'Profesor eliminado',
          text: 'Profesor eliminado exitosamente',
        });
        await fetchProfessors(); // Recargar lista
        setShowDeleteModal(false);
        setProfessorToDelete(null);
      } else {
        throw new Error('Error al eliminar el profesor');
      }
    } catch (error) {
      console.error('❌ Error eliminando profesor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar profesor',
        text: 'Error: No se pudo eliminar al profesor.',
        confirmButtonText: 'Intentar de nuevo'
      });
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

    if (!formData.estilo_enseñanza) {
      errors.estilo_enseñanza = 'El estilo de enseñanza es requerido';
    }

    if (!formData.estilo_clase) {
      errors.estilo_clase = 'El estilo de clase es requerido';
    }

    if (formData.años_experiencia < 0) {
      errors.años_experiencia = 'Los años de experiencia no pueden ser negativos';
    }

    if (formData.evaluacion_docente < 0 || formData.evaluacion_docente > 5) {
      errors.evaluacion_docente = 'La evaluación debe estar entre 0 y 5';
    }

    if (formData.porcentaje_aprobados < 0 || formData.porcentaje_aprobados > 100) {
      errors.porcentaje_aprobados = 'El porcentaje debe estar entre 0 y 100';
    }

    if (formData.disponibilidad < 0 || formData.disponibilidad > 5) {
      errors.disponibilidad = 'La disponibilidad debe estar entre 0 y 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja el envío del formulario para agregar profesor
   */
  const handleSubmitProfessor = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createProfesor(formData);

      if (response && response.success) {
        console.log('✅ Profesor creado exitosamente');
        Swal.fire({
          icon: 'success',
          title: 'Profesro creado',
          text: 'Profesor creado exitosamente',
        });
        await fetchProfessors(); // Recargar lista
        setShowAddModal(false);
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear profesor',
          text: 'Error: No se pudo crear al profesor.',
          confirmButtonText: 'Intentar de nuevo'
        });
        throw new Error('Error al crear el profesor');
      }
    } catch (error) {
      console.error('❌ Error creando profesor:', error);
      alert('Error al crear el profesor. Inténtalo de nuevo.');
      Swal.fire({
        icon: 'error',
        title: 'Error al crear profesor',
        text: 'Error: No se pudo crear al profesor.',
        confirmButtonText: 'Intentar de nuevo'
      });
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
      estilo_enseñanza: '',
      estilo_clase: '',
      años_experiencia: 0,
      evaluacion_docente: 0,
      porcentaje_aprobados: 0,
      disponibilidad: 0
    });
    setFormErrors({});
  };

  /**
   * Cierra el modal de agregar profesor
   */
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // ===== RENDERIZADO CONDICIONAL =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
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
              Administración de Profesores
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar Profesor</span>
            </button>
          </div>

          {/* Debug: Mostrar cantidad de profesores */}
          {professors && professors.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-800">No hay profesores registrados en el sistema.</p>
            </div>
          )}

          {/* Tabla de profesores */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="py-3 px-6">Imagen</th>
                  <th scope="col" className="py-3 px-6">Nombre</th>
                  <th scope="col" className="py-3 px-6">Experiencia</th>
                  <th scope="col" className="py-3 px-6">Evaluación</th>
                  <th scope="col" className="py-3 px-6">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {professors && professors.length > 0 ? (
                  professors.map((professor, index) => {
                    // Debug: Log cada profesor individualmente
                    console.log(`👨‍🏫 Profesor ${index}:`, professor);

                    return (
                      <tr key={professor.nombre || professor.name || index} className="bg-white border-b hover:bg-gray-50">
                        {/* Imagen */}
                        <td className="py-4 px-6">
                          <div className="relative">
                            <img
                              className="w-10 h-10 rounded-full object-cover bg-gray-200"
                              src="/images/professor-avatar.jpg"  // Imagen genérica local
                              alt={`Avatar de ${professor.nombre || professor.name || 'Profesor'}`}
                              onError={(e) => {
                                // Fallback seguro que nunca fallará
                                e.target.onerror = null;
                                e.target.className = "w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center";
                                e.target.src = "";
                                e.target.outerHTML = `
                                  <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                    <span class="text-teal-800 font-medium text-sm">
                                      ${(professor.nombre || professor.name || 'P').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </td>

                        {/* Nombre - Compatibilidad con ambos formatos */}
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {professor.nombre || professor.name || 'Nombre no disponible'}
                        </td>

                        {/* Años de experiencia */}
                        <td className="py-4 px-6">
                          {professor.años_experiencia || professor.experience || 0} años
                        </td>

                        {/* Evaluación docente - Compatibilidad con ambos formatos */}
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1">
                              {professor.evaluacion_docente || professor.rating || 0}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleProfessorSelect(professor.nombre || professor.name)}
                              className="font-medium text-teal-600 hover:underline"
                            >
                              Ver detalles
                            </button>
                            <button
                              onClick={() => handleDeleteClick(professor)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Eliminar profesor"
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
                    <td colSpan="8" className="py-8 px-6 text-center text-gray-500">
                      No hay profesores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para agregar profesor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Encabezado del modal */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Agregar Nuevo Profesor</h3>
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
              <form onSubmit={handleSubmitProfessor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Ingrese el nombre completo"
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                    )}
                  </div>

                  {/* Años de experiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Años de Experiencia *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.años_experiencia}
                      onChange={(e) => handleInputChange('años_experiencia', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.años_experiencia ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.años_experiencia && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.años_experiencia}</p>
                    )}
                  </div>

                  {/* Evaluación docente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evaluación Docente (0-5) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.evaluacion_docente}
                      onChange={(e) => handleInputChange('evaluacion_docente', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.evaluacion_docente ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.evaluacion_docente && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.evaluacion_docente}</p>
                    )}
                  </div>

                  {/* Estilo de enseñanza */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estilo de Enseñanza *
                    </label>
                    <select
                      value={formData.estilo_enseñanza}
                      onChange={(e) => handleInputChange('estilo_enseñanza', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.estilo_enseñanza ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Seleccionar estilo</option>
                      <option value="mixto">Mixto</option>
                      <option value="practico">Práctico</option>
                      <option value="teorico">Teórico</option>
                    </select>
                    {formErrors.estilo_enseñanza && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.estilo_enseñanza}</p>
                    )}
                  </div>

                  {/* Estilo de clase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estilo de Clase *
                    </label>
                    <select
                      value={formData.estilo_clase}
                      onChange={(e) => handleInputChange('estilo_clase', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.estilo_clase ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Seleccionar estilo</option>
                      <option value="mixto">Mixto</option>
                      <option value="con_tecnologia">Uso de herramientas tecnológicas</option>
                      <option value="sin_tecnologia">Sin uso de herramientas tecnológicas</option>
                    </select>
                    {formErrors.estilo_clase && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.estilo_clase}</p>
                    )}
                  </div>

                  {/* Porcentaje de aprobados */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Porcentaje de Aprobados (0-100) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.porcentaje_aprobados}
                      onChange={(e) => handleInputChange('porcentaje_aprobados', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.porcentaje_aprobados ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.porcentaje_aprobados && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.porcentaje_aprobados}</p>
                    )}
                  </div>

                  {/* Disponibilidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidad (0-5) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.disponibilidad}
                      onChange={(e) => handleInputChange('disponibilidad', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.disponibilidad ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.disponibilidad && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.disponibilidad}</p>
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
                    className={`px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Profesor'}
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
                ¿Estás seguro de que deseas eliminar al profesor <strong>{professorToDelete?.nombre || professorToDelete?.name}</strong>?
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
                  onClick={handleDeleteProfessor}
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

export default AdminProfessors;