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

    // ===== FUNCIONES =====

    /**
     * Obtiene los datos del curso desde la API
     */
    const fetchCourseData = async () => {
        setLoading(true);
        setError(null);

        try {
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
            } else {
                throw new Error('No se encontraron datos del curso');
            }
            
        } catch (err) {
            console.error('Error obteniendo datos del curso:', err);
            setError(`Error al cargar los datos del curso: ${err.message}`);
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
            const response = await apiService.updateCurso(course.codigo, editData);
            
            if (response && response.success) {
                setCourse({ ...course, ...editData });
                setIsEditing(false);
            } else {
                throw new Error('Error al actualizar el curso');
            }
            
        } catch (err) {
            console.error('Error guardando cambios:', err);
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
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
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
                                        Nombre del Curso
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                            onChange={(e) => handleInputChange('codigo', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.codigo}</p>
                                    )}
                                </div>

                                {/* Departamento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Departamento
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.departamento}
                                            onChange={(e) => handleInputChange('departamento', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.departamento}</p>
                                    )}
                                </div>

                                {/* Créditos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Créditos
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            min="0"
                                            value={editData.creditos}
                                            onChange={(e) => handleInputChange('creditos', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{course?.creditos || 0}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;