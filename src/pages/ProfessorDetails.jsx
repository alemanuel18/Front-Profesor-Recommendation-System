// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorDetails.jsx
// @ Date : 26/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente ProfessorDetails
 * 
 * Este componente representa la página de detalles de un profesor específico.
 * Conectado con la API del backend para mostrar información real del profesor y sus cursos.
 * Permite editar todos los parámetros del profesor y gestionar sus cursos asignados.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/Header';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import apiService from '../services/apiService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ProfessorDetails = () => {
    // ===== HOOKS Y ESTADOS =====
    const { professorId } = useParams();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    // Estados locales
    const [professor, setProfessor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    // Estados para gestión de cursos
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [selectedCourseToAdd, setSelectedCourseToAdd] = useState('');
    const [managingCourses, setManagingCourses] = useState(false);

    // ===== EFECTOS =====
    useEffect(() => {
        // Verificar que el usuario es admin
        if (!isAdmin()) {
            navigate('/');
            return;
        }

        if (professorId) {
            fetchProfessorData();
            fetchProfessorCourses();
            fetchAvailableCourses();
        }
    }, [professorId, isAdmin, navigate]);

    // ===== FUNCIONES =====

    /**
     * Obtiene todos los cursos disponibles
     */
    const fetchAvailableCourses = async () => {
        try {
            console.log('🔍 Obteniendo cursos disponibles...');
            const response = await apiService.getCursos();
            if (response && response.success) {
                setAvailableCourses(response.data || []);
                console.log('✅ Cursos disponibles obtenidos:', response.data);
            }
        } catch (err) {
            console.error('❌ Error obteniendo cursos disponibles:', err);
            setAvailableCourses([]);
        }
    };

    /**
     * Obtiene los cursos del profesor desde la API
     */
    const fetchProfessorCourses = async () => {
        try {
            console.log(`🔍 Obteniendo cursos del profesor: ${professorId}`);
            const response = await apiService.getCursosProfesor(professorId);
            if (response && response.success) {
                setCourses(response.data || []);
                console.log('✅ Cursos obtenidos:', response.data);
            }
        } catch (err) {
            console.error('❌ Error obteniendo cursos del profesor:', err);
            setCourses([]);
        }
    };

    /**
     * Obtiene los datos del profesor desde la API
     */
    const fetchProfessorData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🔍 Obteniendo datos del profesor: ${professorId}`);

            const response = await apiService.getProfesor(professorId);

            if (response && response.success && response.data) {
                const prof = response.data;
                setProfessor({
                    nombre: prof.nombre,
                    años_experiencia: prof.años_experiencia || 0,
                    evaluacion_docente: prof.evaluacion_docente || 0,
                    estilo_enseñanza: prof.estilo_enseñanza,
                    estilo_clase: prof.estilo_clase,
                    porcentaje_aprobados: prof.porcentaje_aprobados || 0,
                    disponibilidad: prof.disponibilidad || 0
                });

                // Inicializar datos de edición
                setEditData({
                    nombre: prof.nombre,
                    años_experiencia: prof.años_experiencia || 0,
                    evaluacion_docente: prof.evaluacion_docente || 0,
                    estilo_enseñanza: prof.estilo_enseñanza || '',
                    estilo_clase: prof.estilo_clase || '',
                    porcentaje_aprobados: prof.porcentaje_aprobados || 0,
                    disponibilidad: prof.disponibilidad || 0
                });

                console.log('✅ Datos del profesor obtenidos');
            } else {
                throw new Error('No se encontraron datos del profesor');
            }

        } catch (err) {
            console.error('❌ Error obteniendo datos del profesor:', err);
            setError(`Error al cargar los datos del profesor: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el guardado de cambios
     */
    const handleSaveChanges = async () => {
        setSaving(true);
        setError(null);

        try {
            console.log('💾 Guardando cambios del profesor...');

            const response = await apiService.updateProfesor(professor.nombre, editData);

            if (response && response.success) {
                setProfessor({ ...professor, ...editData });
                setIsEditing(false);
                console.log('✅ Profesor actualizado exitosamente');
                Swal.fire({
                    icon: 'success',
                    title: 'Actualización Exitosa',
                    text: 'Los datos del profesor se han actualizado correctamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Ocurrió un problema con el servidor. Inténtalo más tarde.',
                    confirmButtonText: 'Entendido'
                });
                throw new Error('Error al actualizar el profesor');

            }

        } catch (err) {
            console.error('❌ Error guardando cambios:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error de actualización',
                text: 'No se pudieron actualizar los datos del profesor',
                confirmButtonText: 'Entendido'
            });
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Maneja los cambios en los campos de edición
     */
    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Agrega un curso al profesor
     */
    const handleAddCourse = async () => {
        if (!selectedCourseToAdd) return;

        setManagingCourses(true);
        setError(null);

        try {
            console.log('➕ Agregando curso al profesor...');
            const response = await apiService.asignarCursoProfesor(
                professor.nombre,
                selectedCourseToAdd
            );

            if (response && response.success) {
                // Actualizar la lista de cursos del profesor
                await fetchProfessorCourses();
                // Actualizar la lista de cursos disponibles
                await fetchAvailableCourses();

                setShowAddCourseModal(false);
                setSelectedCourseToAdd('');
                console.log('✅ Curso agregado exitosamente');
            } else {
                throw new Error(response?.message || 'Error al agregar el curso');
            }
        } catch (err) {
            console.error('❌ Error agregando curso:', err);
            setError(err.message || 'Ocurrió un error al agregar el curso');
        } finally {
            setManagingCourses(false);
        }
    };

    /**
     * Elimina un curso del profesor
     */
    const handleDeleteCourse = async () => {
        if (!courseToDelete) return;

        setManagingCourses(true);
        try {
            console.log('🗑️ Eliminando curso del profesor...');
            const response = await apiService.removeCourseFromProfesor(professor.nombre, courseToDelete.codigo);

            if (response && response.success) {
                await fetchProfessorCourses(); // Recargar cursos
                setShowDeleteCourseModal(false);
                setCourseToDelete(null);
                console.log('✅ Curso eliminado exitosamente');
            } else {
                throw new Error('Error al eliminar el curso');
            }
        } catch (err) {
            console.error('❌ Error eliminando curso:', err);
            setError(err.message);
        } finally {
            setManagingCourses(false);
        }
    };

    /**
     * Maneja el regreso a la lista de profesores
     */
    const handleGoBack = () => {
        navigate('/admin/professors');
    };

    /**
     * Maneja el modo de edición
     */
    const toggleEditMode = () => {
        if (isEditing) {
            // Cancelar edición - restaurar datos originales
            setEditData({
                nombre: professor.nombre,
                años_experiencia: professor.años_experiencia || 0,
                evaluacion_docente: professor.evaluacion_docente || 0,
                estilo_enseñanza: professor.estilo_enseñanza || '',
                estilo_clase: professor.estilo_clase || '',
                disponibilidad: professor.disponibilidad || 0,
                porcentaje_aprobados: professor.porcentaje_aprobados || 0
            });
        }
        setIsEditing(!isEditing);
        setError(null);
    };

    /**
     * Obtiene los cursos no asignados al profesor
     */
    const getUnassignedCourses = () => {
        const assignedCodes = courses.map(course => course.codigo || course.code);
        return availableCourses.filter(course =>
            !assignedCodes.includes(course.codigo || course.code)
        );
    };

    // ===== RENDERIZADO CONDICIONAL =====
    if (loading) {
        return (
            <div className="flex">
                <AdminSidebar />
                <div className="ml-64 flex-1 w-full">
                    <Header />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando información del profesor...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !professor) {
        return (
            <div className="flex">
                <AdminSidebar />
                <div className="ml-64 flex-1 w-full">
                    <Header />
                    <div className="p-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 flex-1 w-full">
                <Header />
                <div className="p-8">
                    {/* Encabezado con navegación */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleGoBack}
                                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <h1 className="text-3xl font-bold text-teal-600">
                                Detalle del Profesor
                            </h1>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex space-x-3">
                            <button
                                onClick={toggleEditMode}
                                disabled={saving}
                                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isEditing
                                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isEditing ? 'Cancelar' : 'Editar Profesor'}
                            </button>

                            {isEditing && (
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 ${saving ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Error: {error}</span>
                            </div>
                        </div>
                    )}

                    {/* Contenido principal */}
                    <div className="space-y-8">
                        {/* Información del profesor */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-teal-700 mb-6">Información del Profesor</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{professor?.nombre}</p>
                                    )}
                                </div>

                                {/* Años de experiencia */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Años de Experiencia
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={editData.años_experiencia}
                                            onChange={(e) => handleInputChange('años_experiencia', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{professor?.años_experiencia || 0} años</p>
                                    )}
                                </div>

                                {/* Evaluación docente */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Evaluación Docente
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={editData.evaluacion_docente}
                                            onChange={(e) => handleInputChange('evaluacion_docente', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="text-gray-900 mr-2">{professor?.evaluacion_docente || 0}</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= (professor?.evaluacion_docente || 0)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Estilo de enseñanza */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estilo de Enseñanza
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editData.estilo_enseñanza}
                                            onChange={(e) => handleInputChange('estilo_enseñanza', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="">Seleccionar estilo</option>
                                            <option value="visual">Visual</option>
                                            <option value="práctico">Práctico</option>
                                            <option value="teórico">Teórico</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 capitalize">{professor?.estilo_enseñanza || 'No especificado'}</p>
                                    )}
                                </div>

                                {/* Estilo de clase */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estilo de Clase
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editData.estilo_clase}
                                            onChange={(e) => handleInputChange('estilo_clase', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="">Seleccionar estilo</option>
                                            <option value="presencial">Presencial</option>
                                            <option value="virtual">Virtual</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 capitalize">{professor?.estilo_clase || 'No especificado'}</p>
                                    )}
                                </div>

                                {/* Porcentaje de aprobados */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Porcentaje de Aprobados
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={editData.porcentaje_aprobados}
                                            onChange={(e) => handleInputChange('porcentaje_aprobados', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{professor?.porcentaje_aprobados || 0}%</p>
                                    )}
                                </div>

                                {/* Disponibilidad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Disponibilidad
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            value={editData.disponibilidad}
                                            onChange={(e) => handleInputChange('disponibilidad', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{professor?.disponibilidad || 0}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección de estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Cursos Activos */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-teal-700 mb-2">Cursos Activos</h3>
                                <p className="text-3xl font-bold">{courses?.length || 0}</p>
                            </div>
                        </div>

                        {/* Tabla de cursos asignados */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-teal-700">Cursos Asignados</h3>
                                <button
                                    onClick={() => setShowAddCourseModal(true)}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Agregar Curso</span>
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                {courses && courses.length > 0 ? (
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Curso</th>
                                                <th scope="col" className="px-6 py-3">Código</th>
                                                <th scope="col" className="px-6 py-3">Estado</th>
                                                <th scope="col" className="px-6 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course, index) => (
                                                <tr key={course.codigo || index} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {course.nombre || course.name || `Curso ${index + 1}`}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {course.codigo || course.code || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            Activo
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => {
                                                                setCourseToDelete(course);
                                                                setShowDeleteCourseModal(true);
                                                            }}
                                                            disabled={managingCourses}
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos asignados</h3>
                                        <p className="text-gray-500">Este profesor no tiene cursos asignados actualmente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar curso */}
            {showAddCourseModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Agregar Curso al Profesor
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <select
                                    value={selectedCourseToAdd}
                                    onChange={(e) => setSelectedCourseToAdd(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Seleccionar curso</option>
                                    {getUnassignedCourses().map((course) => (
                                        <option key={course.codigo || course.code} value={course.codigo || course.code}>
                                            {course.nombre || course.name} ({course.codigo || course.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleAddCourse}
                                    disabled={!selectedCourseToAdd || managingCourses}
                                    className="px-4 py-2 bg-teal-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {managingCourses ? 'Agregando...' : 'Agregar Curso'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddCourseModal(false);
                                        setSelectedCourseToAdd('');
                                    }}
                                    disabled={managingCourses}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para confirmar eliminación de curso */}
            {showDeleteCourseModal && courseToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                ¿Estás seguro de que deseas eliminar el curso "{courseToDelete.nombre || courseToDelete.name}"
                                de este profesor? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDeleteCourse}
                                    disabled={managingCourses}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {managingCourses ? 'Eliminando...' : 'Eliminar'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteCourseModal(false);
                                        setCourseToDelete(null);
                                    }}
                                    disabled={managingCourses}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfessorDetails;