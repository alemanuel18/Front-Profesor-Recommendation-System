// @ Front-Profesor-Recommendation-System
// @ File Name : CourseDetails.jsx
// @ Date : 26/05/2025
// @ Author : Marcelo Detlefsen

/**
 * Componente CourseDetails
 * 
 * Este componente representa la página de detalles de un curso específico.
 * Permite editar todos los parámetros del curso.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/Header';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import apiService from '../services/apiService';

const CourseDetails = () => {
    // ===== HOOKS Y ESTADOS =====
    const { courseId } = useParams();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    
    // Estados locales
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    // ===== EFECTOS =====
    useEffect(() => {
        // Verificar que el usuario es admin
        if (!isAdmin()) {
            navigate('/');
            return;
        }
        
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId, isAdmin, navigate]);

    // ===== FUNCIONES AUXILIARES =====

    /**
     * Función para extraer mensaje de error legible
     */
    const extractErrorMessage = (error) => {
        console.log('🔍 Analizando error:', error);
        
        // Si es un string, devolverlo directamente
        if (typeof error === 'string') {
            return error;
        }
        
        // Si es un objeto con message
        if (error && error.message) {
            return error.message;
        }
        
        // Si es una respuesta de API con estructura específica
        if (error && error.response) {
            if (error.response.data) {
                if (error.response.data.detail) {
                    return error.response.data.detail;
                }
                if (error.response.data.message) {
                    return error.response.data.message;
                }
                if (typeof error.response.data === 'string') {
                    return error.response.data;
                }
            }
            if (error.response.statusText) {
                return `Error ${error.response.status}: ${error.response.statusText}`;
            }
        }
        
        // Si es un error de red
        if (error && error.code === 'NETWORK_ERROR') {
            return 'Error de conexión. Verifique su conexión a internet y que el servidor esté disponible.';
        }
        
        // Si es un error de timeout
        if (error && error.code === 'ECONNABORTED') {
            return 'La petición tardó demasiado tiempo. Inténtelo nuevamente.';
        }
        
        // Intentar convertir el objeto a string de manera útil
        try {
            const errorStr = JSON.stringify(error, null, 2);
            if (errorStr !== '{}') {
                return `Error del servidor: ${errorStr}`;
            }
        } catch (e) {
            // Si no se puede serializar, usar toString
        }
        
        // Último recurso
        return error?.toString() || 'Error desconocido. Inténtelo nuevamente.';
    };

    // ===== FUNCIONES PRINCIPALES =====

    /**
     * Obtiene los datos del curso desde la API
     */
    const fetchCourseData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🔍 Obteniendo datos del curso: ${courseId}`);
            
            const response = await apiService.getCurso(courseId);
            
            if (response && response.success && response.data) {
                const courseData = response.data;
                setCourse({
                    nombre: courseData.nombre,
                    codigo: courseData.codigo,
                    departamento: courseData.departamento,
                    creditos: courseData.creditos || 0
                });
                
                // Inicializar datos de edición
                setEditData({
                    nombre: courseData.nombre,
                    codigo: courseData.codigo,
                    departamento: courseData.departamento,
                    creditos: courseData.creditos || 0
                });
                
                console.log('✅ Datos del curso obtenidos:', courseData);
            } else {
                throw new Error(response?.message || 'No se encontraron datos del curso');
            }
            
        } catch (err) {
            console.error('❌ Error obteniendo datos del curso:', err);
            const errorMessage = extractErrorMessage(err);
            setError(`Error al cargar los datos del curso: ${errorMessage}`);
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
            console.log('💾 Guardando cambios del curso...');
            console.log('Datos a enviar:', editData);
            
            // Validar datos antes de enviar
            if (!editData.nombre || !editData.nombre.trim()) {
                throw new Error('El nombre del curso es obligatorio');
            }
            
            if (!editData.departamento || !editData.departamento.trim()) {
                throw new Error('El departamento es obligatorio');
            }
            
            if (editData.creditos < 0 || editData.creditos > 20) {
                throw new Error('Los créditos deben estar entre 0 y 20');
            }

            // Preparar datos para actualización (solo campos que cambiaron)
            const updateData = {};
            
            if (editData.nombre !== course.nombre) {
                updateData.nombre = editData.nombre.trim();
            }
            if (editData.departamento !== course.departamento) {
                updateData.departamento = editData.departamento.trim();
            }
            if (editData.creditos !== course.creditos) {
                updateData.creditos = parseInt(editData.creditos);
            }

            // Si no hay cambios, no hacer nada
            if (Object.keys(updateData).length === 0) {
                console.log('ℹ️ No hay cambios para guardar');
                setIsEditing(false);
                return;
            }

            console.log('📤 Datos de actualización:', updateData);

            const response = await apiService.updateCurso(course.codigo, updateData);
            
            if (response && response.success) {
                console.log('✅ Curso actualizado exitosamente:', response.data);
                
                // Actualizar el estado local con los nuevos datos
                setCourse({ 
                    ...course, 
                    nombre: editData.nombre.trim(),
                    departamento: editData.departamento.trim(),
                    creditos: parseInt(editData.creditos)
                });
                
                setIsEditing(false);
                
                // Mostrar mensaje de éxito temporal
                const successMessage = 'Curso actualizado exitosamente';
                console.log('✅ ' + successMessage);
                
            } else {
                throw new Error(response?.message || 'Error al actualizar el curso');
            }
            
        } catch (err) {
            console.error('❌ Error guardando cambios:', err);
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
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
        
        // Limpiar error al hacer cambios
        if (error) {
            setError(null);
        }
    };

    /**
     * Maneja el regreso a la lista de cursos
     */
    const handleGoBack = () => {
        navigate('/admin/courses');
    };

    /**
     * Maneja el modo de edición
     */
    const toggleEditMode = () => {
        if (isEditing) {
            // Cancelar edición - restaurar datos originales
            setEditData({
                nombre: course.nombre,
                codigo: course.codigo,
                departamento: course.departamento,
                creditos: course.creditos || 0
            });
        }
        setIsEditing(!isEditing);
        setError(null);
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
                            <p className="text-gray-600">Cargando información del curso...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !course) {
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
                                Detalle del Curso
                            </h1>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex space-x-3">
                            <button
                                onClick={toggleEditMode}
                                disabled={saving}
                                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                    isEditing 
                                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                                        : 'bg-teal-600 text-white hover:bg-teal-700'
                                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isEditing ? 'Cancelar' : 'Editar Curso'}
                            </button>
                            
                            {isEditing && (
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 ${
                                        saving ? 'opacity-50 cursor-not-allowed' : ''
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
                        {/* Información del curso */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-teal-700 mb-6">Información del Curso</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Curso *
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="Ingrese el nombre del curso"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{course?.nombre}</p>
                                    )}
                                </div>

                                {/* Código */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código del Curso
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.codigo}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            title="El código del curso no se puede modificar"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.codigo}</p>
                                    )}
                                </div>

                                {/* Departamento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Departamento *
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.departamento}
                                            onChange={(e) => handleInputChange('departamento', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="Ingrese el departamento"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.departamento}</p>
                                    )}
                                </div>

                                {/* Créditos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Créditos *
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={editData.creditos}
                                            onChange={(e) => handleInputChange('creditos', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="0"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.creditos || 0}</p>
                                    )}
                                </div>
                            </div>

                            {/* Nota sobre campos obligatorios */}
                            {isEditing && (
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>* Campos obligatorios</p>
                                    <p>• El código del curso no puede ser modificado</p>
                                    <p>• Los créditos deben estar entre 0 y 20</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;