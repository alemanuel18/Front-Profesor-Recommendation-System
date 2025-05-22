// @ Front-Profesor-Recommendation-System
// @ File Name : Home.jsx
// @ Date : 21/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

// Este archivo representa la página principal del sistema de recomendación de profesores.
// Actualizado para conectarse con la API del backend.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Header from '../Components/Header';
import Card_Estudiante from '../Components/Cards/Card_Estudiante';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import apiService from '../services/apiService';

const Home = () => {
    // ===== HOOKS Y CONTEXTO =====
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const studentData = useStudent();

    // ===== ESTADOS =====
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiHealthy, setApiHealthy] = useState(false);

    // ===== EFECTOS =====
    useEffect(() => {
        initializePage();
    }, [studentData.name]);

    // ===== FUNCIONES =====

    /**
     * Inicializa la página cargando datos del estudiante
     */
    const initializePage = async () => {
        setLoading(true);
        setError(null);

        try {
            // Verificar estado de la API
            const healthCheck = await apiService.healthCheck();
            setApiHealthy(healthCheck.success || false);

            // Si tenemos el nombre del estudiante, obtener sus datos
            if (studentData.name) {
                await fetchStudentData(studentData.name);
            } else {
                // Usar datos del contexto si no hay conexión API
                setStudentInfo({
                    id: studentData.id,
                    carne: studentData.carne,
                    name: studentData.name,
                    carrera: studentData.carrera,
                    pensum: studentData.pensum,
                    promedioCicloAnterior: studentData.promedioCicloAnterior,
                    grado: studentData.grado,
                    cargaMaxima: studentData.cargaMaxima
                });
            }

        } catch (err) {
            console.error('Error inicializando la página:', err);
            setError(err.message);
            
            // Usar datos del contexto como fallback
            setStudentInfo({
                id: studentData.id,
                carne: studentData.carne,
                name: studentData.name,
                carrera: studentData.carrera,
                pensum: studentData.pensum,
                promedioCicloAnterior: studentData.promedioCicloAnterior,
                grado: studentData.grado,
                cargaMaxima: studentData.cargaMaxima
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene los datos del estudiante desde la API
     */
    const fetchStudentData = async (studentName) => {
        try {
            console.log(`🔍 Obteniendo datos del estudiante: ${studentName}`);
            
            const response = await apiService.getEstudiante(studentName);
            
            if (response && response.success && response.data) {
                const student = response.data;
                setStudentInfo({
                    id: student.id || studentData.id,
                    carne: student.carne || studentData.carne,
                    name: student.nombre || studentName,
                    carrera: student.carrera || studentData.carrera,
                    pensum: student.pensum || studentData.pensum,
                    promedioCicloAnterior: student.promedio_ciclo_anterior || studentData.promedioCicloAnterior,
                    grado: student.grado || studentData.grado,
                    cargaMaxima: student.carga_maxima || studentData.cargaMaxima,
                    estiloAprendizaje: student.estilo_aprendizaje,
                    preferenciaClase: student.preferencia_clase,
                    cursosAprobados: student.cursos_aprobados || []
                });
                
                console.log('✅ Datos del estudiante obtenidos desde API');
            } else {
                throw new Error('No se pudieron obtener los datos del estudiante');
            }
            
        } catch (apiError) {
            console.warn('⚠️ Error obteniendo datos de API, usando datos del contexto:', apiError);
            
            // Fallback a datos del contexto
            setStudentInfo({
                id: studentData.id,
                carne: studentData.carne,
                name: studentName,
                carrera: studentData.carrera,
                pensum: studentData.pensum,
                promedioCicloAnterior: studentData.promedioCicloAnterior,
                grado: studentData.grado,
                cargaMaxima: studentData.cargaMaxima
            });
        }
    };

    /**
     * Maneja la navegación a la página de cursos
     */
    const handleNavigateToCourses = () => {
        navigate('/cursos');
    };

    // Determina qué componente lateral mostrar según el rol del usuario
    const SidebarComponent = isAdmin() ? (
        <AdminSidebar />
    ) : (
        <Sidebar Name={studentInfo?.name || studentData.name} />
    );

    // ===== RENDERIZADO CONDICIONAL =====
    if (loading) {
        return (
            <div className="flex">
                {SidebarComponent}
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

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="flex">
            {/* Renderiza el componente lateral correspondiente */}
            {SidebarComponent}
            
            <div className="ml-64 flex-1 w-full">
                {/* Header muestra el encabezado de la página */}
                <Header />
                
                <div className="p-8">
                    {/* Título principal de la página */}
                    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                        Asignación de Cursos
                    </h1>

                    {/* Indicador de estado de la API */}
                    <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                        apiHealthy 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-yellow-50 border-yellow-500'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {apiHealthy ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm ${
                                    apiHealthy ? 'text-green-700' : 'text-yellow-700'
                                }`}>
                                    {apiHealthy 
                                        ? 'Conectado al sistema de recomendaciones' 
                                        : 'Usando datos locales - Funcionalidad limitada'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Aviso: {error}</span>
                            </div>
                        </div>
                    )}

                    {/* Tarjeta que muestra información detallada del estudiante */}
                    <div className="flex justify-center mt-8">
                        <Card_Estudiante
                            id={studentInfo?.id || studentData.id}
                            Carne={studentInfo?.carne || studentData.carne}
                            Name={studentInfo?.name || studentData.name}
                            Carrera={studentInfo?.carrera || studentData.carrera}
                            Pensum={studentInfo?.pensum || studentData.pensum}
                            Promedio_Ciclo_Anterior={studentInfo?.promedioCicloAnterior || studentData.promedioCicloAnterior}
                            Grado={studentInfo?.grado || studentData.grado}
                            Carga_MAX={studentInfo?.cargaMaxima || studentData.cargaMaxima}
                        />
                    </div>

                    {/* Información adicional si se obtuvieron datos de la API */}
                    {studentInfo?.estiloAprendizaje && (
                        <div className="flex justify-center mt-6">
                            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl w-full">
                                <h3 className="text-lg font-semibold text-teal-700 mb-4">Perfil de Aprendizaje</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600">Estilo de Aprendizaje:</span>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {studentInfo.estiloAprendizaje}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Preferencia de Clase:</span>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {studentInfo.preferenciaClase}
                                        </p>
                                    </div>
                                </div>
                                {studentInfo.cursosAprobados?.length > 0 && (
                                    <div className="mt-4">
                                        <span className="text-sm text-gray-600">Cursos Aprobados:</span>
                                        <p className="font-medium text-gray-900">
                                            {studentInfo.cursosAprobados.length} cursos completados
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botón para navegar a la página de cursos */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleNavigateToCourses}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
                        >
                            {apiHealthy ? 'Ver Recomendaciones Personalizadas' : 'Asignarse'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;