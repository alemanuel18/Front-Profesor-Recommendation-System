// @ Front-Profesor-Recommendation-System
// @ File Name : Seleccion_Profesores.jsx
// @ Date : 27/05/2025
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
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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
        setLoading(true);
        
        // VALIDAR que studentName esté definido
        if (!studentName || studentName.trim() === '') {
            console.error('❌ Error: studentName no está definido');
            setError('Nombre del estudiante no disponible');
            setLoading(false);
            return;
        }
        
        try {
            console.log(`🔍 Obteniendo recomendaciones para "${studentName}"`);

            // Llamada al API usando el método corregido
            const response = await ApiService.getRecomendaciones(studentName, { 
                codigoCurso: courseCode, 
                incluirDetalles: true 
            });
            
            console.log('📊 Respuesta completa del backend:', response);
            
            // Extraer recomendaciones de la respuesta
            const recomendacionesData = response?.data?.recomendaciones || response?.recomendaciones || [];
            
            console.log('📋 Recomendaciones extraídas:', recomendacionesData);
            
            if (recomendacionesData && Array.isArray(recomendacionesData) && recomendacionesData.length > 0) {
                // Mapear las recomendaciones al formato esperado
                const formattedRecommendations = recomendacionesData.map((rec, index) => {
                    console.log(`👨‍🏫 Procesando profesor: ${rec.profesor}, Compatibilidad: ${rec.porcentaje_recomendacion}%`);
                    
                    return {
                        id: index,
                        professorName: rec.profesor,
                        rating: parseFloat(rec.evaluacion_docente) || 4.0,
                        experience: parseInt(rec.años_experiencia) || 5,
                        approvalRate: parseFloat(rec.porcentaje_aprobados) || 75,
                        teachingStyle: rec.estilo_enseñanza || 'tradicional',
                        classStyle: rec.estilo_clase || 'presencial',
                        image: getProfessorImage(index),
                        // USAR EL PORCENTAJE REAL DEL ALGORITMO
                        compatibilityScore: parseFloat(rec.porcentaje_recomendacion) || 0,
                        reasons: getReasonsForProfessor(rec),
                        // Campos adicionales para debugging
                        indiceCompatibilidad: rec.indice_compatibilidad,
                        detallesCalculo: rec.detalles_calculo
                    };
                });
                
                // Ordenar por compatibilidad descendente
                formattedRecommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
                
                setRecommendations(formattedRecommendations);
                console.log(`✅ Se obtuvieron ${formattedRecommendations.length} recomendaciones`);
                
                // Mostrar estadísticas de compatibilidad
                const avgCompatibility = formattedRecommendations.reduce((sum, rec) => sum + rec.compatibilityScore, 0) / formattedRecommendations.length;
                const maxCompatibility = Math.max(...formattedRecommendations.map(r => r.compatibilityScore));
                const minCompatibility = Math.min(...formattedRecommendations.map(r => r.compatibilityScore));
                
                console.log(`📈 Estadísticas de compatibilidad:`);
                console.log(`   - Promedio: ${avgCompatibility.toFixed(2)}%`);
                console.log(`   - Máximo: ${maxCompatibility.toFixed(2)}%`);
                console.log(`   - Mínimo: ${minCompatibility.toFixed(2)}%`);
                
            } else {
                console.warn('⚠️ No se encontraron recomendaciones válidas, obteniendo profesores del curso');
                // PASAR studentName explícitamente al fallback
                await fetchCourseProfessors(courseCode, studentName);
            }

        } catch (err) {
            console.error('❌ Error obteniendo recomendaciones:', err);
            console.error('📄 Detalles del error:', err.response?.data || err.message);
            // Como fallback, obtener profesores del curso PASANDO studentName
            await fetchCourseProfessors(courseCode, studentName);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene todos los profesores del curso como fallback
     * PARÁMETRO AÑADIDO: studentNameParam para evitar el error de null
     */
    const fetchCourseProfessors = async (courseCode, studentNameParam = null) => {
        // Usar el parámetro pasado o el estado global
        const currentStudentName = studentNameParam || studentName;
        
        // VALIDAR que tengamos un nombre de estudiante
        if (!currentStudentName || currentStudentName.trim() === '') {
            console.error('❌ Error: No se puede obtener compatibilidad sin nombre del estudiante');
            console.log('🔄 Obteniendo solo profesores del curso sin compatibilidad...');
            
            // Fallback: obtener profesores sin compatibilidad
            try {
                const response = await ApiService.getProfesoresPorCurso(courseCode);
                const professors = response.data || response || [];
                
                const professorsWithoutCompatibility = professors.map((prof, index) => ({
                    id: index,
                    professorName: prof.nombre,
                    rating: parseFloat(prof.evaluacion_docente) || 4.0,
                    experience: parseInt(prof.años_experiencia) || 5,
                    approvalRate: parseFloat(prof.porcentaje_aprobados) || 75,
                    teachingStyle: prof.estilo_enseñanza || 'tradicional',
                    classStyle: prof.estilo_clase || 'presencial',
                    image: getProfessorImage(index),
                    compatibilityScore: 0, // Sin compatibilidad disponible
                    reasons: ["Información de compatibilidad no disponible"],
                }));
                
                setAllProfessors(professorsWithoutCompatibility);
                setRecommendations(professorsWithoutCompatibility);
                console.log(`⚠️ Se obtuvieron ${professors.length} profesores SIN compatibilidad`);
            } catch (error) {
                console.error('❌ Error obteniendo profesores básicos:', error);
                setRecommendations([]);
                setAllProfessors([]);
            }
            return;
        }
        
        try {
            console.log(`👥 Obteniendo profesores del curso ${courseCode} para estudiante "${currentStudentName}"`);

            const response = await ApiService.getProfesoresPorCurso(courseCode);
            const professors = response.data || response || [];
            
            console.log('👥 Profesores del curso obtenidos:', professors);

            if (professors.length > 0) {
                // Convertir profesores a formato de recomendación CON compatibilidad real
                const professorsAsRecommendations = await Promise.all(
                    professors.map(async (prof, index) => {
                        let compatibilityScore = 0; // Inicializar en 0 para detectar fallos
                        
                        try {
                            console.log(`🎯 Obteniendo compatibilidad para "${currentStudentName}" y "${prof.nombre}"`);
                            
                            // Usar el método correcto del API CON VALIDACIÓN
                            const compatibilityResponse = await ApiService.getPorcentajeRecomendacion(
                                currentStudentName, 
                                prof.nombre
                            );
                            
                            if (compatibilityResponse?.data?.porcentaje !== undefined) {
                                compatibilityScore = parseFloat(compatibilityResponse.data.porcentaje);
                                console.log(`✅ Compatibilidad específica para ${prof.nombre}: ${compatibilityScore}%`);
                            } else {
                                console.warn(`⚠️ Respuesta sin porcentaje para ${prof.nombre}:`, compatibilityResponse);
                            }
                        } catch (compatErr) {
                            console.warn(`⚠️ Error obteniendo compatibilidad para ${prof.nombre}:`, compatErr.message);
                            // Mantener compatibilityScore = 0 para debug
                        }
                        
                        return {
                            id: index,
                            professorName: prof.nombre,
                            rating: parseFloat(prof.evaluacion_docente) || 4.0,
                            experience: parseInt(prof.años_experiencia) || 5,
                            approvalRate: parseFloat(prof.porcentaje_aprobados) || 75,
                            teachingStyle: prof.estilo_enseñanza || 'tradicional',
                            classStyle: prof.estilo_clase || 'presencial',
                            image: getProfessorImage(index),
                            compatibilityScore: compatibilityScore, // Usar el valor real obtenido
                            reasons: getReasonsForProfessor(prof),
                        };
                    })
                );

                // Ordenar por compatibilidad descendente
                professorsAsRecommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

                setAllProfessors(professorsAsRecommendations);
                setRecommendations(professorsAsRecommendations);
                
                console.log(`✅ Se obtuvieron ${professors.length} profesores con compatibilidad:`);
                professorsAsRecommendations.forEach(prof => {
                    console.log(`   - ${prof.professorName}: ${prof.compatibilityScore}%`);
                });
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

    /**
     * Función auxiliar para obtener imagen del profesor
     */
    const getProfessorImage = (index) => {
        const imageIndex = (index % 10) + 1;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=professor${imageIndex}`;
    };

    /**
     * Función auxiliar para generar razones de recomendación
     */
    const getReasonsForProfessor = (prof) => {
        const reasons = [];
        
        // Usar los campos que vienen del algoritmo
        if (prof.compatibilidad_estilos && prof.compatibilidad_estilos > 80) {
            reasons.push("Excelente compatibilidad de estilos");
        }
        if (prof.evaluacion_docente && parseFloat(prof.evaluacion_docente) > 4.0) {
            reasons.push("Alta evaluación docente");
        }
        if (prof.porcentaje_aprobados && parseFloat(prof.porcentaje_aprobados) > 80) {
            reasons.push("Alto índice de aprobación");
        }
        if (prof.años_experiencia && parseInt(prof.años_experiencia) > 10) {
            reasons.push("Amplia experiencia docente");
        }
        if (prof.afinidad && prof.afinidad > 70) {
            reasons.push("Recomendado por estudiantes similares");
        }
        if (prof.porcentaje_recomendacion && prof.porcentaje_recomendacion > 85) {
            reasons.push("Alta compatibilidad general");
        }
        
        return reasons.length > 0 ? reasons : ["Profesor capacitado para el curso"];
    };

    /**
     * Datos de respaldo para cursos
     */
    const getFallbackCourseData = (courseId) => {
        const fallbackCourses = {
            "MAT101": { codigo: "MAT101", nombre: "Cálculo 1"},
            "MAT102": { codigo: "MAT102", nombre: "Álgebra Lineal 1"},
            "EST101": { codigo: "EST101", nombre: "Estadística 1"},
            "MAT201": { codigo: "MAT201", nombre: "Cálculo 2"},
            "CC101": { codigo: "CC101", nombre: "Programación 1"}
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
                Swal.fire({
                    icon: 'error',
                    title: 'Falta de Disponibilidad',
                    text: 'El profesor no tiene disponibilidad actualmente',
                });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inscripción',
                    text: 'Error al inscribirse al curso',
                    confirmButtonText: 'Entendido'
                });
                throw new Error(inscripcionResponse.message || 'Error al inscribirse al curso');
            }

            // Actualizar UI inmediatamente
            setEnrollmentCheck({
                loading: false,
                isEnrolled: true,
                currentProfessor: professorName,
                error: null
            });

            Swal.fire({
                icon: 'success',
                title: 'Inscrito',
                text: '¡Inscripción exitosa!',
            });

        } catch (error) {
            console.error('Error en el proceso de inscripción:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Ocurrió un problema con el servidor. Inténtalo más tarde.',
                confirmButtonText: 'Entendido'
            });
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Buscar por profesor, o estilo de enseñanza..."
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
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Todos ({recommendations.length})
                                </button>

                                <button
                                    onClick={() => setSelectedFilter('high_compatibility')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'high_compatibility'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Alta Compatibilidad (90%+)
                                </button>

                                <button
                                    onClick={() => setSelectedFilter('high_rating')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'high_rating'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Mejor Evaluados (4.5+)
                                </button>

                                <button
                                    onClick={() => setSelectedFilter('experienced')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'experienced'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Muy Experimentados (10+ años)
                                </button>

                                <button
                                    onClick={() => setSelectedFilter('high_approval')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'high_approval'
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
                                    {recommendation.compatibilityScore.toFixed(1)}% Compatible
                                </div>

                                {/* Tarjeta del profesor */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
                                    {/* Imagen y datos básicos */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover bg-gray-200"
                                                src="/images/student-avatar.jpg"
                                                alt={`Avatar de ${recommendation.professorName || 'Profesor'}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.className = "w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center";
                                                    e.target.src = "";
                                                    e.target.outerHTML = `
                                                        <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                            <span class="text-teal-800 font-medium text-sm">
                                                                ${(recommendation.professorName || 'P').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    `;
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
                                                        {recommendation.rating.toFixed(1)}
                                                    </span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`w-3 h-3 ${
                                                                    star <= recommendation.rating
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
}
export default Seleccion_Profesores;
