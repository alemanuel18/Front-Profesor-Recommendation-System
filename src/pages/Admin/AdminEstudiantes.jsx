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
 * - Permite agregar nuevos estudiantes
 * - Implementa control de acceso administrativo
 * - Adaptado al modelo Estudiante.py
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

const AdminEstudiantes = () => {
  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== ESTADOS LOCALES =====
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    carnet: '',
    carrera: '',
    pensum: 2020,
    email: '',
    password: '',
    estilo_aprendizaje: '',
    estilo_clase: '',
    promedio: 0,
    grado: 'Primer año',
    carga_maxima: 1,
    cursos_zona_minima: 0
  });
  const [formErrors, setFormErrors] = useState({});

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
        alert('Error: No se pudo identificar el estudiante a eliminar.');
        return;
    }

    setIsSubmitting(true);
    try {
        console.log('🌐 Enviando petición de eliminación para:', carnetEstudiante);
        const response = await apiService.deleteEstudiante(carnetEstudiante);
        
        // Verificar la respuesta de manera más flexible
        if (response && (response.success || response.status === 200 || response.status === 204)) {
        console.log('✅ Estudiante eliminado exitosamente');
        // Forzar actualización del estado
        setStudents(prev => prev.filter(s => s.carnet !== carnetEstudiante));
        setShowDeleteModal(false);
        setStudentToDelete(null);
        } else {
        throw new Error(response?.message || 'Error al eliminar el estudiante');
        }
    } catch (error) {
        console.error('❌ Error eliminando estudiante:', error);
        alert(`Error al eliminar el estudiante: ${error.message || 'Error desconocido'}`);
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
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.carnet.trim()) {
      errors.carnet = 'El carnet es requerido';
    }

    if (!formData.carrera.trim()) {
      errors.carrera = 'La carrera es requerida';
    }

    if (formData.pensum < 2020 || formData.pensum > 2030) {
      errors.pensum = 'El pensum debe estar entre 2020 y 2030';
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.estilo_aprendizaje) {
      errors.estilo_aprendizaje = 'El estilo de aprendizaje es requerido';
    }

    if (!formData.estilo_clase) {
      errors.estilo_clase = 'El estilo de clase es requerido';
    }

    if (formData.promedio < 0 || formData.promedio > 100) {
      errors.promedio = 'El promedio debe estar entre 0 y 100';
    }

    if (formData.carga_maxima < 1 || formData.carga_maxima > 7) {
      errors.carga_maxima = 'La carga máxima debe estar entre 1 y 7';
    }

    if (formData.cursos_zona_minima < 0 || formData.cursos_zona_minima > 7) {
      errors.cursos_zona_minima = 'Los cursos con zona mínima deben estar entre 0 y 7';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja el envío del formulario para agregar estudiante
   */
  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createEstudiante(formData);
      
      if (response && response.success) {
        console.log('✅ Estudiante creado exitosamente');
        await fetchStudents(); // Recargar lista
        setShowAddModal(false);
        resetForm();
      } else {
        throw new Error('Error al crear el estudiante');
      }
    } catch (error) {
      console.error('❌ Error creando estudiante:', error);
      alert('Error al crear el estudiante. Inténtalo de nuevo.');
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
      carnet: '',
      carrera: '',
      pensum: 2020,
      email: '',
      password: '',
      estilo_aprendizaje: '',
      estilo_clase: '',
      promedio: 0,
      grado: 'Primer año',
      carga_maxima: 1,
      cursos_zona_minima: 0
    });
    setFormErrors({});
  };

  /**
   * Cierra el modal de agregar estudiante
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
              Administración de Estudiantes
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar Estudiante</span>
            </button>
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

      {/* Modal para agregar estudiante */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Encabezado del modal */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Agregar Nuevo Estudiante</h3>
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
              <form onSubmit={handleSubmitStudent} className="space-y-4">
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese el nombre completo"
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                    )}
                  </div>

                  {/* Carnet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carnet *
                    </label>
                    <input
                      type="text"
                      value={formData.carnet}
                      onChange={(e) => handleInputChange('carnet', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.carnet ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese el carnet"
                    />
                    {formErrors.carnet && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.carnet}</p>
                    )}
                  </div>

                  {/* Carrera */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrera *
                    </label>
                    <input
                      type="text"
                      value={formData.carrera}
                      onChange={(e) => handleInputChange('carrera', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.carrera ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese la carrera"
                    />
                    {formErrors.carrera && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.carrera}</p>
                    )}
                  </div>

                  {/* Pensum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pensum (2020-2030) *
                    </label>
                    <input
                      type="number"
                      min="2020"
                      max="2030"
                      value={formData.pensum}
                      onChange={(e) => handleInputChange('pensum', parseInt(e.target.value) || 2020)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.pensum ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.pensum && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.pensum}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ejemplo@correo.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña (mínimo 6 caracteres) *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese la contraseña"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Estilo de aprendizaje */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estilo de Aprendizaje *
                    </label>
                    <select
                      value={formData.estilo_aprendizaje}
                      onChange={(e) => handleInputChange('estilo_aprendizaje', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.estilo_aprendizaje ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar estilo</option>
                      <option value="mixto">Mixto</option>
                      <option value="practico">Práctico</option>
                      <option value="teorico">Teórico</option>
                    </select>
                    {formErrors.estilo_aprendizaje && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.estilo_aprendizaje}</p>
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.estilo_clase ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar estilo</option>
                      <option value="con_tecnologia">Con tecnología</option>
                      <option value="sin_tecnologia">Sin tecnología</option>
                      <option value="mixto">Mixto</option>
                    </select>
                    {formErrors.estilo_clase && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.estilo_clase}</p>
                    )}
                  </div>

                  {/* Promedio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Promedio (0-100) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.promedio}
                      onChange={(e) => handleInputChange('promedio', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.promedio ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.promedio && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.promedio}</p>
                    )}
                  </div>

                  {/* Grado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grado *
                    </label>
                    <select
                      value={formData.grado}
                      onChange={(e) => handleInputChange('grado', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.grado ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Primer año">Primer año</option>
                      <option value="Segundo año">Segundo año</option>
                      <option value="Tercer año">Tercer año</option>
                      <option value="Cuarto año">Cuarto año</option>
                      <option value="Quinto año">Quinto año</option>
                      <option value="Sexto año">Sexto año</option>
                    </select>
                    {formErrors.grado && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.grado}</p>
                    )}
                  </div>

                  {/* Carga máxima */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carga Máxima (1-7) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={formData.carga_maxima}
                      onChange={(e) => handleInputChange('carga_maxima', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.carga_maxima ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.carga_maxima && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.carga_maxima}</p>
                    )}
                  </div>

                  {/* Cursos con zona mínima */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cursos con Zona Mínima (0-7) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={formData.cursos_zona_minima}
                      onChange={(e) => handleInputChange('cursos_zona_minima', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.cursos_zona_minima ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cursos_zona_minima && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.cursos_zona_minima}</p>
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
                    {isSubmitting ? 'Guardando...' : 'Guardar Estudiante'}
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

export default AdminEstudiantes;