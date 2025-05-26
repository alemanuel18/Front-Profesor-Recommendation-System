// @ Front-Profesor-Recommendation-System
// @ File Name : Seleccion_Profesores.jsx
// @ Date : 25/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Componente Seleccion_Profesores
 * 
 * Este componente implementa la página de selección de profesores para un curso específico.
 * Integrado completamente con el sistema de API backend.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import Header from '../Components/Header';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Sidebar from '../Components/Sidebar';
import ApiService from '../services/apiService';

const Seleccion_Profesores = () => {
    // ===== HOOKS Y ESTADOS =====
    const { cursoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, isAdmin } = useAuth();
    const { name: studentName } = useStudent();
    
    // Estados locales
    const [courseInfo, setCourseInfo] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [allProfessors, setAllProfessors] = useState([]);
    const [filteredRecommendations, setFilteredRecommendations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [processingSelection, setProcessingSelection] = useState(false);

    const [enrollmentCheck, setEnrollmentCheck] = useState({
        loading: false,
        isEnrolled: false,
        currentProfessor: null,
        error: null
        });

    // ===== EFECTOS =====
    
    // Obtener información del curso y recomendaciones
    useEffect(() => {
        if (cursoId) {
            fetchCourseAndRecommendations();
        }
    }, [cursoId, studentName]);

    // Filtrar recomendaciones por término de búsqueda y filtro seleccionado
    useEffect(() => {
        applyFilters();
    }, [recommendations, allProfessors, searchTerm, selectedFilter]);

    // Verificar inscripción del estudiante al curso
    useEffect(() => {
    if (!studentName || !courseInfo?.codigo) return;

    const checkEnrollment = async () => {
        setEnrollmentCheck(prev => ({...prev, loading: true}));
        try {
        const inscripcionInfo = await ApiService.getInformacionInscripcion(
            currentUser.carnet, 
            courseInfo.codigo
        );
        setEnrollmentCheck({
            loading: false,
            isEnrolled: inscripcionInfo.esta_inscrito,
            currentProfessor: inscripcionInfo.profesor_actual,
            error: null
        });
        } catch (error) {
        setEnrollmentCheck({
            loading: false,
            isEnrolled: false,
            currentProfessor: null,
            error: error.message
        });
        }
    };

    checkEnrollment();
    }, [studentName, courseInfo?.codigo, currentUser.carnet]);


    // ===== FUNCIONES PRINCIPALES =====

    /**
     * Obtiene información del curso y las recomendaciones
     */
    const fetchCourseAndRecommendations = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Obtener información del curso desde el estado de navegación o la API
            let courseData = null;
            
            if (location.state && location.state.courseCode) {
                // Usar datos del estado de navegación
                courseData = {
                    codigo: location.state.courseCode,
                    nombre: location.state.courseName,
                };
            } else {
                // Obtener curso desde la API usando el ID/código
                try {
                    courseData = await ApiService.getCurso(cursoId);
                } catch (courseError) {
                    console.warn('No se pudo obtener el curso desde la API, usando datos por defecto');
                    courseData = getFallbackCourseData(cursoId);
                }
            }
            
            setCourseInfo(courseData);
            console.log(`📚 Curso cargado: ${courseData.nombre} (${courseData.codigo})`);

            // Obtener recomendaciones si hay un estudiante autenticado
            if (studentName) {
                await fetchRecommendations(courseData.codigo);
            } else {
                // Si no hay estudiante, mostrar todos los profesores del curso
                await fetchCourseProfessors(courseData.codigo);
            }
            
        } catch (err) {
            console.error('❌ Error cargando datos:', err);
            setError(`Error al cargar la información: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene las recomendaciones de profesores para el estudiante
     */
    const fetchRecommendations = async (courseCode) => {
        try {
            console.log(`🔍 Obteniendo recomendaciones para ${studentName}`);
            
            const recs = await ApiService.getRecomendaciones(studentName);
            
            if (recs && recs.length > 0) {
                // Filtrar recomendaciones para el curso actual si es necesario
                const courseRecommendations = recs.filter(rec => 
                    !courseCode || rec.codigo_curso === courseCode
                );
                
                setRecommendations(courseRecommendations);
                console.log(`✅ Se obtuvieron ${courseRecommendations.length} recomendaciones`);
            } else {
                console.warn('⚠️ No se encontraron recomendaciones, obteniendo profesores del curso');
                // Fallback: obtener profesores del curso
                await fetchCourseProfessors(courseCode);
            }
            
        } catch (err) {
            console.error('❌ Error obteniendo recomendaciones:', err);
            // Fallback: obtener profesores del curso
            await fetchCourseProfessors(courseCode);
        }
    };

    /**
     * Obtiene todos los profesores del curso como fallback
     */
    const fetchCourseProfessors = async (courseCode) => {
        try {
            console.log(`👥 Obteniendo profesores del curso ${courseCode}`);
            
            const response = await ApiService.getProfesoresPorCurso(courseCode);
            const professors = response.data || []; // Asegurarse de acceder a response.data
            // Usar servicio externo confiable para placeholders
            const getProfessorImage = (index) => 
                `https://www.flaticon.es/icono-gratis/persona_3577429`;
            
            if (professors.length > 0) {
                // Convertir profesores a formato de recomendación
                const professorsAsRecommendations = professors.map((prof, index) => ({
                    id: index,
                    professorName: prof.nombre,
                    rating: parseFloat(prof.evaluacion_docente) || 4.0,
                    experience: parseInt(prof.años_experiencia) || 5,
                    approvalRate: parseFloat(prof.porcentaje_aprobados) || 75,
                    teachingStyle: prof.estilo_enseñanza || 'tradicional',
                    classStyle: prof.estilo_clase || 'presencial',
                    image: getProfessorImage(index), // Imagen de profesor (placeholder)
                    compatibilityScore: calculateCompatibility(prof), // Función que calcula compatibilidad
                    reasons: getReasonsForProfessor(prof) // Función que genera razones
                }));
                
                setAllProfessors(professorsAsRecommendations);
                setRecommendations(professorsAsRecommendations);
                console.log(`✅ Se obtuvieron ${professors.length} profesores del curso`);
            } else {
                console.warn('⚠️ No se encontraron profesores para este curso');
                setRecommendations([]);
                setAllProfessors([]);
            }
            
        } catch (err) {
            console.error('❌ Error obteniendo profesores del curso:', err);
            setRecommendations([]);
            setAllProfessors([]);
        }
    };

    // Función auxiliar para calcular compatibilidad (puedes personalizarla)
    const calculateCompatibility = (professor) => {
        // Ejemplo simple basado en evaluación docente y porcentaje de aprobados
        const baseScore = (professor.evaluacion_docente * 10) + (professor.porcentaje_aprobados * 0.5);
        return Math.min(100, baseScore); // Asegurar que no pase de 100
    };

    // Función auxiliar para generar razones de recomendación
    const getReasonsForProfessor = (professor) => {
        const reasons = [];
        
        if (professor.años_experiencia >= 5) {
            reasons.push(`Experiencia (${professor.años_experiencia} años)`);
        }
        
        if (professor.evaluacion_docente >= 4.0) {
            reasons.push(`Alta evaluación (${professor.evaluacion_docente}/5.0)`);
        }
        
        if (professor.porcentaje_aprobados >= 75) {
            reasons.push(`Alto porcentaje de aprobados (${professor.porcentaje_aprobados}%)`);
        }
        
        reasons.push(`Estilo de enseñanza: ${professor.estilo_enseñanza}`);
        
        return reasons.length > 0 ? reasons : ['Profesor verificado'];
    };

    /**
     * Datos de respaldo para cursos
     */
    const getFallbackCourseData = (courseId) => {
        const fallbackCourses = {
            "MAT101": { codigo: "MAT101", nombre: "Cálculo 1", departamento: "Matemáticas" },
            "MAT102": { codigo: "MAT102", nombre: "Álgebra Lineal 1", departamento: "Matemáticas" },
            "EST101": { codigo: "EST101", nombre: "Estadística 1", departamento: "Estadística" },
            "MAT201": { codigo: "MAT201", nombre: "Cálculo 2", departamento: "Matemáticas" },
            "CC101": { codigo: "CC101", nombre: "Programación 1", departamento: "Ciencias de la Computación" }
        };
        
        return fallbackCourses[courseId] || { 
            codigo: courseId, 
            nombre: "Curso", 
        };
    };

    /**
     * Aplica filtros de búsqueda y categoría a las recomendaciones
     */
    const applyFilters = () => {
        let filtered = [...recommendations];

        // Filtrar por término de búsqueda
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(rec =>
                rec.professorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.teachingStyle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.classStyle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por categoría seleccionada
        switch (selectedFilter) {
            case 'high_rating':
                filtered = filtered.filter(rec => rec.rating >= 4.5);
                break;
            case 'high_approval':
                filtered = filtered.filter(rec => rec.approvalRate >= 80);
                break;
            case 'experienced':
                filtered = filtered.filter(rec => rec.experience >= 10);
                break;
            case 'high_compatibility':
                filtered = filtered.filter(rec => rec.compatibilityScore >= 90);
                break;
            default:
                // 'all' - no filtrar
                break;
        }

        // Ordenar por puntuación de compatibilidad (descendente)
        filtered.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

        setFilteredRecommendations(filtered);
    };

    /**
     * Maneja la selección de un profesor para inscribirse en su curso
     */
    const handleProfessorSelect = async (professorId, professorName) => {
    if (processingSelection || enrollmentCheck.loading || enrollmentCheck.isEnrolled) return;
    
    try {
        setProcessingSelection(true);
        
        // Mostrar diálogo de confirmación primero
        const confirmed = window.confirm(
        `¿Deseas inscribirte con el profesor ${professorName} para el curso ${courseInfo?.nombre}?\n\nUna vez inscrito, no podrás cambiarte de profesor.`
        );
        
        if (!confirmed) {
        setProcessingSelection(false);
        return;
        }

        // Verificar disponibilidad del profesor
        const profesorResponse = await ApiService.getProfesor(professorName);
        if (!profesorResponse?.data?.disponibilidad || profesorResponse.data.disponibilidad <= 0) {
        throw new Error('El profesor no tiene disponibilidad actualmente');
        }

        // Inscribir estudiante
        const inscripcionResponse = await ApiService.asignarEstudianteCurso(
        currentUser.carnet,
        {
            codigo_curso: courseInfo.codigo,
            nombre_profesor: professorName
        }
        );

        if (!inscripcionResponse.success) {
        throw new Error(inscripcionResponse.message || 'Error al inscribirse al curso');
        }

        // Actualizar UI inmediatamente
        setEnrollmentCheck({
        loading: false,
        isEnrolled: true,
        currentProfessor: professorName,
        error: null
        });

        alert(`¡Inscripción exitosa!\n\nCurso: ${courseInfo.nombre}\nProfesor: ${professorName}`);
        
    } catch (error) {
        console.error('Error en el proceso de inscripción:', error);
        let errorMessage = error.response?.data?.message || error.message;
        alert(`Error al inscribirse: ${errorMessage}`);
    } finally {
        setProcessingSelection(false);
    }
    };

    /**
     * Limpia todos los filtros
     */
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedFilter('all');
    };

    /**
     * Reintenta cargar los datos
     */
    const retryLoading = () => {
        fetchCourseAndRecommendations();
    };

    // Determinar qué barra lateral mostrar según el rol del usuario
    const SidebarComponent = isAdmin() ? (
        <AdminSidebar />
    ) : (
        <Sidebar Name={studentName} />
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
                            <p className="text-gray-600">Cargando información del curso...</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {studentName ? 
                                    'Obteniendo recomendaciones personalizadas...' : 
                                    'Cargando profesores disponibles...'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== RENDERIZADO DEL COMPONENTE =====
    return (
        <div className="flex">
            {/* Barra lateral según el rol del usuario */}
            {SidebarComponent}
            
            <div className="ml-64 flex-1 w-full">
                <Header />
                
                <div className="container mx-auto p-8">
                    {/* Información del curso */}
                    {courseInfo && (
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <h1 className="text-3xl font-bold text-teal-600 mr-4">{courseInfo.nombre}</h1>
                                <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full font-semibold">
                                    {courseInfo.codigo}
                                </span>
                                {courseInfo.departamento && (
                                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold ml-2">
                                        {courseInfo.departamento}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600">
                                {studentName ? 
                                    'Selecciona el profesor que mejor se adapte a tu estilo de aprendizaje' :
                                    'Profesores disponibles para este curso'
                                }
                            </p>
                        </div>
                    )}

                    {/* Información de recomendaciones personalizadas */}
                    {studentName && recommendations.length > 0 && (
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-l-4 border-teal-400 p-6 mb-8 rounded-r-lg">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-teal-800">
                                        Recomendaciones Personalizadas para {studentName}
                                    </h3>
                                    <p className="text-sm text-teal-700 mt-1">
                                        Estos profesores han sido seleccionados específicamente para ti basándose en tu estilo de aprendizaje, 
                                        rendimiento académico y preferencias de clase.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controles de búsqueda y filtros */}
                    {recommendations.length > 0 && (
                        <div className="mb-8 space-y-4">
                            {/* Barra de búsqueda */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input 
                                    type="search" 
                                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500" 
                                    placeholder="Buscar por profesor, departamento o estilo de enseñanza..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Filtros */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-sm font-medium text-gray-700 mr-2">Filtrar por:</span>
                                
                                <button
                                    onClick={() => setSelectedFilter('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedFilter === 'all' 
                                            ? 'bg-teal-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Todos ({recommendations.length})
                                </button>
                                
                                <button
                                    onClick={() => setSelectedFilter('high_compatibility')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedFilter === 'high_compatibility' 
                                            ? 'bg-teal-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Alta Compatibilidad (90%+)
                                </button>
                                
                                <button
                                    onClick={() => setSelectedFilter('high_rating')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedFilter === 'high_rating' 
                                            ? 'bg-teal-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Mejor Evaluados (4.5+)
                                </button>
                                
                                <button
                                    onClick={() => setSelectedFilter('experienced')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedFilter === 'experienced' 
                                            ? 'bg-teal-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Muy Experimentados (10+ años)
                                </button>
                                
                                <button
                                    onClick={() => setSelectedFilter('high_approval')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedFilter === 'high_approval' 
                                            ? 'bg-teal-600 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Alto % Aprobación (80%+)
                                </button>

                                {(searchTerm || selectedFilter !== 'all') && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-4"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline"> {error}</span>
                                    <button
                                        onClick={retryLoading}
                                        className="mt-2 text-sm underline hover:no-underline"
                                    >
                                        Intentar de nuevo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contador de recomendaciones */}
                    {filteredRecommendations.length > 0 && (
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                Mostrando {filteredRecommendations.length} de {recommendations.length} 
                                {studentName ? ' recomendaciones' : ' profesores'}
                                {searchTerm && ` para "${searchTerm}"`}
                            </p>
                            <div className="text-sm text-gray-500">
                                {studentName ? 'Ordenado por compatibilidad' : 'Profesores del curso'}
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando no hay recomendaciones que coincidan */}
                    {filteredRecommendations.length === 0 && !loading && (
                        <div className="text-center py-10">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33C5.64 12.49 6 12.265 6 12c0-.265-.36-.49-.64-.67C7.536 10.881 9.66 10 12 10s4.464.881 6.08 2.33c-.28.18-.64.405-.64.67 0 .265.36.49.64.67A7.96 7.96 0 0112 15z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No se encontraron profesores
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? 
                                    'No hay profesores que coincidan con tu búsqueda actual.' :
                                    recommendations.length === 0 ?
                                        'No hay profesores disponibles para este curso en este momento.' :
                                        'No hay profesores que coincidan con los filtros seleccionados.'
                                }
                            </p>
                            {(searchTerm || selectedFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Ver todos los profesores
                                </button>
                            )}
                        </div>
                    )}

                    {/* Verificación de inscripción */}
                    {enrollmentCheck.loading ? (
                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                        <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <p className="text-sm text-gray-600">Verificando estado de inscripción...</p>
                        </div>
                    </div>
                    ) : enrollmentCheck.isEnrolled ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                            <strong>Ya estás inscrito en este curso</strong> con el profesor {enrollmentCheck.currentProfessor}. 
                            No puedes cambiarte de profesor una vez inscrito.
                            </p>
                        </div>
                        </div>
                    </div>
                    ) : null}

                    {/* Grid de recomendaciones de profesores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecommendations.map((recommendation, index) => (
                            <div key={recommendation.id} className="relative">
                                {/* Indicador de ranking (solo si es recomendación personalizada) */}
                                {studentName && (
                                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                        #{index + 1}
                                    </div>
                                )}
                                
                                {/* Indicador de puntuación de compatibilidad */}
                                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {recommendation.compatibilityScore?.toFixed(1) || '75.0'}% Compatible
                                </div>
                                
                                {/* Tarjeta del profesor */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
                                    {/* Imagen y datos básicos */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={recommendation.image}
                                                alt={recommendation.professorName}
                                                className="w-16 h-16 rounded-full object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.src = getProfessorImage(index);
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {recommendation.professorName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {recommendation.department}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Información adicional de recomendación */}
                                        <div className="space-y-3">
                                            {/* Evaluación */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Evaluación:</span>
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-yellow-600 mr-1">
                                                        {recommendation.rating?.toFixed(1) || '4.0'}
                                                    </span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`w-3 h-3 ${
                                                                    star <= (recommendation.rating || 4)
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Experiencia */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Experiencia:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {recommendation.experience} años
                                                </span>
                                            </div>
                                            
                                            {/* Porcentaje de aprobación */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">% Aprobación:</span>
                                                <span className="font-semibold text-green-600">
                                                    {recommendation.approvalRate}%
                                                </span>
                                            </div>
                                            
                                            {/* Estilo de enseñanza */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Estilo:</span>
                                                <span className="font-semibold text-blue-600 capitalize">
                                                    {recommendation.teachingStyle}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botón de selección */}
                                    <div className="px-6 pb-6">
                                        <button
                                            onClick={() => handleProfessorSelect(recommendation.id, recommendation.professorName)}
                                            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Seleccionar Profesor
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Información adicional */}
                    {filteredRecommendations.length > 0 && (
                        <div className="mt-12 bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Información sobre las Recomendaciones
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <strong>Puntuación de Compatibilidad:</strong> Basada en la similitud entre tu estilo de aprendizaje 
                                    y el estilo de enseñanza del profesor.
                                </div>
                                <div>
                                    <strong>Sistema de Ranking:</strong> Los profesores están ordenados por su compatibilidad contigo 
                                    y factores como evaluación docente y porcentaje de aprobación.
                                </div>
                                <div>
                                    <strong>Recomendaciones Personalizadas:</strong> El algoritmo considera tu historial académico, 
                                    preferencias y patrones de éxito de estudiantes similares.
                                </div>
                                <div>
                                    <strong>Datos Actualizados:</strong> Las estadísticas se actualizan regularmente para 
                                    ofrecerte la información más precisa.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seleccion_Profesores;