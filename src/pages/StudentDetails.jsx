// @ Front-Profesor-Recommendation-System
// @ File Name : StudentDetails.jsx
// @ Date : 24/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente StudentDetails
 * 
 * Este componente representa la página de detalles de un estudiante específico.
 * Permite visualizar y editar la información personal y académica del estudiante.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import SignUpForm from '../Components/SignUpForm';
import apiService from '../services/apiService';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const StudentDetails = () => {
    // ===== HOOKS Y ESTADOS =====
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Estados locales
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cursosAsignados, setCursosAsignados] = useState([]);

    // ===== EFECTOS =====
    useEffect(() => {
        // Verificar que el usuario esté autenticado
        if (!currentUser) {
            console.log('❌ Usuario no autenticado, redirigiendo a login...');
            navigate('/login');
            return;
        }

        console.log('✅ Usuario autenticado:', currentUser);
        fetchStudentData();
        fetchCursosAsignados();
    }, [currentUser, navigate]);

    // ===== FUNCIONES =====

    /**
     * Obtiene los datos del estudiante desde la API
     */
    const fetchStudentData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 Obteniendo datos del estudiante...');
            console.log('👤 Usuario actual:', currentUser);

            // Intentar obtener datos desde la API
            if (currentUser?.carnet || currentUser?.id) {
                const carnetEstudiante = currentUser.carnet || currentUser.id;

                try {
                    const response = await apiService.getEstudiante(carnetEstudiante);
                    console.log('📥 Respuesta de la API:', response);

                    if (response && response.success && response.data) {
                        // Mapear los campos de la respuesta de la API correctamente
                        const apiData = response.data;
                        const studentData = {
                            // Información básica
                            nombre: apiData.nombre || apiData.nombreCompleto || apiData.name || '',
                            carnet: apiData.carnet || apiData.id || '',
                            email: apiData.email || `${apiData.carnet || apiData.id}@uvg.edu.gt`,

                            // Información académica 
                            carrera: apiData.carrera || '',
                            pensum: apiData.pensum || '',
                            promedio: apiData.promedio || apiData.promedioAnterior || 0,
                            grado: apiData.grado || '',
                            carga_maxima: apiData.carga_maxima || apiData.cargaMaxima || 0,
                            cursos_zona_minima: apiData.cursos_zona_minima || apiData.cursosZonaMinima || 0,

                            // Preferencias de aprendizaje
                            estilo_aprendizaje: apiData.estilo_aprendizaje || apiData.estiloAprendizaje || '',
                            estilo_clase: apiData.estilo_clase || apiData.estiloClase || '',

                            // Fechas
                            fecha_registro: apiData.fecha_registro || apiData.fechaRegistro || new Date().toISOString()
                        };

                        setStudent(studentData);
                        console.log('✅ Datos del estudiante obtenidos desde API:', studentData);
                        return;
                    }
                } catch (apiError) {
                    console.warn('⚠️ Error obteniendo desde API:', apiError);
                    setError(`Error al obtener datos: ${apiError.message}`);
                }
            }

            // Si no se pudieron obtener datos de la API, mostrar error
            setError('No se pudieron obtener los datos del estudiante desde la API');

        } catch (err) {
            console.error('❌ Error obteniendo datos del estudiante:', err);
            setError(`Error general: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene los cursos asignados del estudiante desde la API
     */
    const fetchCursosAsignados = async () => {
        try {
            console.log('📚 Obteniendo cursos asignados...');

            if (currentUser?.carnet || currentUser?.id) {
                const carnetEstudiante = currentUser.carnet || currentUser.id;

                try {
                    const response = await apiService.getCursosEstudiante(carnetEstudiante);
                    console.log('📚 Respuesta cursos API:', response);

                    if (response && response.success && response.data) {
                        const cursosData = Array.isArray(response.data) ? response.data : [];
                        setCursosAsignados(cursosData);
                        console.log('✅ Cursos obtenidos desde API:', cursosData);
                    } else {
                        console.log('⚠️ No se encontraron cursos en la respuesta');
                        setCursosAsignados([]);
                    }
                } catch (apiError) {
                    console.warn('⚠️ Error obteniendo cursos desde API:', apiError);
                    setCursosAsignados([]);
                }
            }

        } catch (err) {
            console.error('❌ Error obteniendo cursos asignados:', err);
            setCursosAsignados([]);
        }
    };

    /**
     * Maneja la actualización de datos del estudiante
     */
    const handleUpdateStudent = async (formData) => {
        setSaving(true);
        setError(null);

        try {
            console.log('💾 Actualizando datos del estudiante...');
            console.log('📝 Datos del formulario recibidos:', formData);

            if (student?.carnet) {
                // Transformar los datos al formato que espera la API
                const apiData = {
                    nombre: formData.nombre, // Ya viene mapeado del SignUpForm
                    carnet: formData.carnet,
                    email: formData.email,
                    carrera: formData.carrera,
                    pensum: formData.pensum,
                    promedio: formData.promedio, // Ya viene mapeado del SignUpForm
                    grado: formData.grado,
                    carga_maxima: formData.carga_maxima, // Ya viene mapeado del SignUpForm
                    cursos_zona_minima: formData.cursos_zona_minima, // Ya viene mapeado del SignUpForm
                    estilo_aprendizaje: formData.estilo_aprendizaje, // Ya viene mapeado del SignUpForm
                    estilo_clase: formData.estilo_clase // Ya viene mapeado del SignUpForm
                };

                // Solo incluir password si se está cambiando
                if (formData.password) {
                    apiData.password = formData.password;
                }

                console.log('📤 Datos a enviar a la API:', apiData);

                const response = await apiService.updateEstudiante(student.carnet, apiData);
                console.log('📥 Respuesta de actualización:', response);

                if (response && response.success) {
                    // Actualizar el estado local con los nuevos datos
                    // Usar la misma estructura que usamos al cargar los datos
                    const updatedStudent = {
                        // Mantener campos que no cambian
                        carnet: student.carnet,
                        fecha_registro: student.fecha_registro,

                        // Actualizar con los nuevos datos
                        nombre: apiData.nombre,
                        email: apiData.email,
                        carrera: apiData.carrera,
                        pensum: apiData.pensum,
                        promedio: apiData.promedio,
                        grado: apiData.grado,
                        carga_maxima: apiData.carga_maxima,
                        cursos_zona_minima: apiData.cursos_zona_minima,
                        estilo_aprendizaje: apiData.estilo_aprendizaje,
                        estilo_clase: apiData.estilo_clase
                    };

                    console.log('✅ Actualizando estado local con:', updatedStudent);
                    setStudent(updatedStudent);

                    setIsEditing(false);
                    console.log('✅ Estudiante actualizado exitosamente');
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualización Exitosa',
                        text: 'Los datos del estudiante se han actualizado correctamente.',
                    });

                    // Mostrar mensaje de éxito
                    setError(null);

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'Ocurrió un problema con el servidor. Inténtalo más tarde.',
                        confirmButtonText: 'Entendido'
                    });
                    throw new Error(response?.message || 'No se pudo actualizar el estudiante');
                }
            } else {
                throw new Error('No se encontró el carnet del estudiante');
            }

        } catch (err) {
            console.error('❌ Error actualizando estudiante:', err);
            setError('Error al actualizar los datos: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Maneja el regreso al dashboard
     */
    const handleGoBack = () => {
        navigate('/dashboard');
    };

    /**
     * Maneja el modo de edición
     */
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setError(null);
    };

    /**
     * Calcula estadísticas del estudiante
     */
    const getEstadisticas = () => {
        const totalCreditos = cursosAsignados.reduce((sum, curso) => sum + (curso.creditos || 0), 0);
        const cursosActivos = cursosAsignados.filter(curso => curso.estado === 'Cursando').length;
        const cursosAprobados = cursosAsignados.filter(curso => curso.estado === 'Aprobado').length;

        return {
            totalCreditos,
            cursosActivos,
            cursosAprobados,
            promedioGeneral: student?.promedio || 0,
            cargaMaxima: student?.carga_maxima || 0
        };
    };

    /**
     * Formatea la fecha para mostrar
     */
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        try {
            return new Date(fecha).toLocaleDateString('es-GT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return fecha;
        }
    };

    /**
     * Formatea el estilo de aprendizaje para mostrar
     */
    const formatearEstiloAprendizaje = (estilo) => {
        const estilos = {
            'practico': 'Práctico',
            'teorico': 'Teórico',
            'mixto': 'Mixto'
        };
        return estilos[estilo] || 'No especificado';
    };

    /**
     * Formatea el estilo de clase para mostrar
     */
    const formatearEstiloClase = (estilo) => {
        const estilos = {
            'con_tecnologia': 'Uso de herramientas tecnológicas',
            'sin_tecnologia': 'Sin uso de herramientas tecnológicas',
            'mixto': 'Mixto'
        };
        return estilos[estilo] || 'No especificado';
    };

    // ===== RENDERIZADO CONDICIONAL =====
    if (loading) {
        return (
            <div className="flex">
                <Sidebar Name={currentUser?.name || currentUser?.nombre || 'Estudiante'} />
                <div className="ml-64 flex-1 w-full">
                    <Header />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando información del estudiante...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const estadisticas = getEstadisticas();

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="flex">
            <Sidebar Name={student?.nombre || currentUser?.name || currentUser?.nombre || 'Estudiante'} />
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
                                Mi Perfil Estudiantil
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
                                {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
                            </button>
                        </div>
                    </div>

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Mostrar mensaje si no hay datos */}
                    {!student && !loading && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>No se pudieron cargar los datos del estudiante desde la API.</span>
                            </div>
                        </div>
                    )}

                    {/* Contenido principal */}
                    {student && (
                        <>
                            {isEditing ? (
                                /* Modo de edición - Mostrar formulario */
                                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                                    <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                                        Actualizar Información Personal
                                    </h2>
                                    <SignUpForm
                                        onSubmit={handleUpdateStudent}
                                        isLoading={saving}
                                        error={error}
                                        initialData={student}
                                        isEditMode={true}
                                    />
                                </div>
                            ) : (
                                /* Modo de visualización */
                                <div className="space-y-8">
                                    {/* Tarjeta de información personal */}
                                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                        <h3 className="text-xl font-semibold text-teal-700 mb-6">Información Personal</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Nombre Completo */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nombre Completo
                                                </label>
                                                <p className="text-gray-900 font-medium">{student.nombre || 'No especificado'}</p>
                                            </div>

                                            {/* Carnet */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Carnet
                                                </label>
                                                <p className="text-gray-900 font-mono text-lg">{student.carnet || 'No especificado'}</p>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Correo Electrónico
                                                </label>
                                                <p className="text-gray-900">{student.email || 'No especificado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tarjeta de información académica */}
                                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                        <h3 className="text-xl font-semibold text-teal-700 mb-6">Información Académica</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Carrera */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Carrera
                                                </label>
                                                <p className="text-gray-900 font-medium">{student.carrera || 'No especificada'}</p>
                                            </div>

                                            {/* Pensum */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pensum
                                                </label>
                                                <p className="text-gray-900">{student.pensum || 'No especificado'}</p>
                                            </div>

                                            {/* Grado */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Grado Académico
                                                </label>
                                                <p className="text-gray-900">{student.grado || 'No especificado'}</p>
                                            </div>

                                            {/* Promedio Anterior */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Promedio Ciclo Anterior
                                                </label>
                                                <p className="text-2xl font-bold text-teal-600">
                                                    {student.promedio ? student.promedio.toFixed(1) : 'N/A'}
                                                </p>
                                            </div>

                                            {/* Carga Máxima */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Carga Máxima
                                                </label>
                                                <p className="text-2xl font-bold text-blue-600">{student.carga_maxima || 0} cursos</p>
                                            </div>

                                            {/* Cursos Zona Mínima */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Cursos con Zona Mínima
                                                </label>
                                                <p className="text-2xl font-bold text-orange-600">{student.cursos_zona_minima || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tarjeta de preferencias */}
                                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                        <h3 className="text-xl font-semibold text-teal-700 mb-6">Preferencias de Aprendizaje</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Estilo de Aprendizaje */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Estilo de Aprendizaje
                                                </label>
                                                <div className="flex items-center">
                                                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                                        {formatearEstiloAprendizaje(student.estilo_aprendizaje)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Estilo de Clase */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Estilo de Clase Preferido
                                                </label>
                                                <div className="flex items-center">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                        {formatearEstiloClase(student.estilo_clase)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabla de cursos asignados */}
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                        <div className="p-6 border-b border-gray-200">
                                            <h3 className="text-xl font-semibold text-teal-700">Cursos Asignados</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            {cursosAsignados && cursosAsignados.length > 0 ? (
                                                <table className="w-full text-sm text-left text-gray-500">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">Código</th>
                                                            <th scope="col" className="px-6 py-3">Curso</th>
                                                            <th scope="col" className="px-6 py-3">Profesor</th>
                                                            <th scope="col" className="px-6 py-3">Estado</th>
                                                            <th scope="col" className="px-6 py-3">Nota</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cursosAsignados.map((curso, index) => (
                                                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                                    {curso.codigo || curso.codigo_curso || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                                    {curso.nombre || curso.nombre_curso || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {curso.profesor || curso.nombre_profesor || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${curso.estado === 'Cursando' || curso.estado === 'activo'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : curso.estado === 'Aprobado' || curso.estado === 'aprobado'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {curso.estado || 'Activo'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {curso.nota !== null && curso.nota !== undefined
                                                                        ? curso.nota
                                                                        : 'En progreso'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="p-6 text-center text-gray-500">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos asignados</h3>
                                                    <p className="text-gray-500">Aún no tienes cursos asignados para este ciclo.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;