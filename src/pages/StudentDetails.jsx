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

const StudentDetails = () => {
    // ===== HOOKS Y ESTADOS =====
    const { currentUser } = useAuth(); // Corregido: usar currentUser en lugar de user
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
     * Obtiene los datos del estudiante desde la API o localStorage
     */
    const fetchStudentData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 Obteniendo datos del estudiante...');
            console.log('👤 Usuario actual:', currentUser);
            
            // Intentar obtener datos desde la API
            if (currentUser?.carnet) {
                const response = await apiService.getEstudiante(currentUser.carnet);
                
                if (response && response.success && response.data) {
                    setStudent(response.data);
                    console.log('✅ Datos del estudiante obtenidos desde API');
                    return;
                }
            }
            
            // Fallback: usar datos del usuario actual
            if (currentUser) {
                setStudent({
                    nombreCompleto: currentUser.nombreCompleto || currentUser.name || '',
                    carnet: currentUser.carnet || currentUser.id || '',
                    carrera: currentUser.carrera || 'Ingeniería en Ciencias de la Computación',
                    pensum: currentUser.pensum || '2024',
                    promedioAnterior: currentUser.promedioAnterior || 85.5,
                    grado: currentUser.grado || 'Tercer año',
                    cargaMaxima: currentUser.cargaMaxima || 5,
                    estiloAprendizaje: currentUser.estiloAprendizaje || 'mixto',
                    estiloClase: currentUser.estiloClase || 'con_tecnologia',
                    cursosZonaMinima: currentUser.cursosZonaMinima || 1,
                    fechaRegistro: currentUser.fechaRegistro || new Date().toISOString(),
                    email: currentUser.email || `${currentUser.carnet || currentUser.id}@uvg.edu.gt`
                });
                console.log('✅ Datos del estudiante obtenidos desde contexto');
            } else {
                throw new Error('No se encontraron datos del estudiante');
            }
            
        } catch (err) {
            console.error('❌ Error obteniendo datos del estudiante:', err);
            setError(err.message);
            
            // Datos mock como último recurso basados en el usuario actual
            setStudent(getMockStudentData());
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene los cursos asignados del estudiante
     */
    const fetchCursosAsignados = async () => {
        try {
            console.log('📚 Obteniendo cursos asignados...');
            
            // Intentar obtener desde la API
            if (currentUser?.carnet) {
                const response = await apiService.getCursosEstudiante(currentUser.carnet);
                
                if (response && response.success && response.data) {
                    setCursosAsignados(response.data);
                    return;
                }
            }
            
            // Datos mock como fallback
            setCursosAsignados(getMockCursosAsignados());
            
        } catch (err) {
            console.error('❌ Error obteniendo cursos asignados:', err);
            setCursosAsignados(getMockCursosAsignados());
        }
    };

    /**
     * Datos mock del estudiante para fallback
     */
    const getMockStudentData = () => {
        return {
            nombreCompleto: currentUser?.name || currentUser?.nombreCompleto || 'JEREZ MELGAR, ALEJANDRO MANUEL',
            carnet: currentUser?.id || '24678',
            carrera: 'Ingeniería en Ciencias de la Computación',
            pensum: '2024',
            promedioAnterior: 85.5,
            grado: 'Tercer año',
            cargaMaxima: 5,
            estiloAprendizaje: 'mixto',
            estiloClase: 'con_tecnologia',
            cursosZonaMinima: 1,
            fechaRegistro: new Date().toISOString(),
            email: `${currentUser?.id || '24678'}@uvg.edu.gt`
        };
    };

    /**
     * Datos mock de cursos asignados
     */
    const getMockCursosAsignados = () => {
        return [
            {
                codigo: 'CC3001',
                nombre: 'Estructuras de Datos',
                profesor: 'Dr. María González',
                seccion: 'A',
                horario: 'Lun/Mie 08:00-09:30',
                creditos: 4,
                estado: 'Cursando',
                nota: null
            },
            {
                codigo: 'MAT2001',
                nombre: 'Cálculo II',
                profesor: 'Lic. Carlos López',
                seccion: 'B',
                horario: 'Mar/Jue 10:00-11:30',
                creditos: 4,
                estado: 'Cursando',
                nota: null
            },
            {
                codigo: 'FIS1001',
                nombre: 'Física I',
                profesor: 'Dr. Ana Martínez',
                seccion: 'A',
                horario: 'Vie 14:00-17:00',
                creditos: 4,
                estado: 'Cursando',
                nota: null
            }
        ];
    };

    /**
     * Maneja la actualización de datos del estudiante
     */
    const handleUpdateStudent = async (formData) => {
        setSaving(true);
        setError(null);

        try {
            console.log('💾 Actualizando datos del estudiante...');
            
            // Intentar actualizar en la API
            if (student?.carnet) {
                const response = await apiService.updateEstudiante(student.carnet, formData);
                
                if (response && response.success) {
                    setStudent({ ...student, ...formData });
                    setIsEditing(false);
                    console.log('✅ Estudiante actualizado exitosamente');
                    return;
                }
            }
            
            // Fallback: actualizar localmente
            setStudent({ ...student, ...formData });
            setIsEditing(false);
            console.log('✅ Datos actualizados localmente');
            
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
        const promedioGeneral = student?.promedioAnterior || 0;
        
        return {
            totalCreditos,
            cursosActivos,
            promedioGeneral,
            cargaMaxima: student?.cargaMaxima || 0
        };
    };

    // ===== RENDERIZADO CONDICIONAL =====
    if (loading) {
        return (
            <div className="flex">
                <Sidebar Name={currentUser?.name || currentUser?.nombreCompleto || 'Estudiante'} />
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
            <Sidebar Name={student?.nombreCompleto || currentUser?.name || currentUser?.nombreCompleto || 'Estudiante'} />
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
                                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                    isEditing 
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

                    {/* Contenido principal */}
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
                                        <p className="text-gray-900 font-medium">{student?.nombreCompleto}</p>
                                    </div>

                                    {/* Carnet */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Carnet
                                        </label>
                                        <p className="text-gray-900">{student?.carnet}</p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <p className="text-gray-900">{student?.email}</p>
                                    </div>

                                    {/* Carrera */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Carrera
                                        </label>
                                        <p className="text-gray-900">{student?.carrera}</p>
                                    </div>

                                    {/* Pensum */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pensum
                                        </label>
                                        <p className="text-gray-900">{student?.pensum}</p>
                                    </div>

                                    {/* Grado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Grado Académico
                                        </label>
                                        <p className="text-gray-900">{student?.grado}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta de información académica */}
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold text-teal-700 mb-6">Información Académica</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Promedio Anterior */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Promedio Ciclo Anterior
                                        </label>
                                        <p className="text-2xl font-bold text-teal-600">{student?.promedioAnterior}</p>
                                    </div>

                                    {/* Carga Máxima */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Carga Máxima
                                        </label>
                                        <p className="text-2xl font-bold text-blue-600">{student?.cargaMaxima} cursos</p>
                                    </div>

                                    {/* Cursos Zona Mínima */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cursos con Zona Mínima
                                        </label>
                                        <p className="text-2xl font-bold text-orange-600">{student?.cursosZonaMinima}</p>
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
                                            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium capitalize">
                                                {student?.estiloAprendizaje || 'No especificado'}
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
                                                {student?.estiloClase === 'con_tecnologia' ? 'Con Tecnología' :
                                                 student?.estiloClase === 'sin_tecnologia' ? 'Sin Tecnología' :
                                                 student?.estiloClase === 'mixto' ? 'Mixto' :
                                                 'No especificado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección de estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Cursos Actuales */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-teal-700 mb-2">Cursos Actuales</h3>
                                    <p className="text-3xl font-bold">{estadisticas.cursosActivos}</p>
                                </div>
                                
                                {/* Promedio General */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-teal-700 mb-2">Promedio General</h3>
                                    <p className="text-3xl font-bold">{estadisticas.promedioGeneral}</p>
                                </div>
                                
                                {/* Carga Disponible */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-teal-700 mb-2">Carga Disponible</h3>
                                    <p className="text-3xl font-bold">
                                        {Math.max(0, estadisticas.cargaMaxima - estadisticas.cursosActivos)}
                                    </p>
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
                                                    <th scope="col" className="px-6 py-3">Sección</th>
                                                    <th scope="col" className="px-6 py-3">Horario</th>
                                                    <th scope="col" className="px-6 py-3">Créditos</th>
                                                    <th scope="col" className="px-6 py-3">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cursosAsignados.map((curso, index) => (
                                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{curso.codigo}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-900">{curso.nombre}</td>
                                                        <td className="px-6 py-4">{curso.profesor}</td>
                                                        <td className="px-6 py-4">{curso.seccion}</td>
                                                        <td className="px-6 py-4">{curso.horario}</td>
                                                        <td className="px-6 py-4">{curso.creditos}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                curso.estado === 'Cursando' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : curso.estado === 'Aprobado'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {curso.estado}
                                                            </span>
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
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;