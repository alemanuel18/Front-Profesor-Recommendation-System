// @ Front-Profesor-Recommendation-System
// @ File Name : useApi.js
// @ Date : 21/05/2025
// @ Author : Marcelo Detlefsen

/**
 * Hooks personalizados para manejo de API
 * 
 * Este archivo contiene hooks reutilizables para interactuar con la API,
 * incluyendo manejo de estados de carga, errores y operaciones asíncronas.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/apiService';
import RecommendationService from '../services/RecommendationService';

/**
 * Hook para realizar operaciones de API con manejo automático de estados
 * @param {Function} apiFunction - Función de API a ejecutar
 * @param {Array} dependencies - Dependencias para re-ejecutar la función
 * @param {Object} options - Opciones del hook
 * @returns {Object} Estado de la operación
 */
export const useApi = (apiFunction, dependencies = [], options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);
    
    const {
        immediate = true,
        onSuccess = null,
        onError = null,
        retryCount = 3,
        retryDelay = 1000
    } = options;
    
    const mountedRef = useRef(true);
    const retryCountRef = useRef(0);

    const fetchData = useCallback(async (forceRefresh = false) => {
        // No ejecutar si el componente no está montado
        if (!mountedRef.current) return;
        
        // Si ya tenemos datos y no es un refresh forzado, no volver a cargar
        if (data && !forceRefresh && !immediate) return;

        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Ejecutando operación de API...');
            const result = await apiFunction();
            
            if (mountedRef.current) {
                setData(result);
                setLastFetch(new Date());
                retryCountRef.current = 0;
                
                if (onSuccess) {
                    onSuccess(result);
                }
                
                console.log('✅ Operación de API completada exitosamente');
            }
        } catch (err) {
            console.error('❌ Error en operación de API:', err);
            
            if (mountedRef.current) {
                // Implementar lógica de reintentos
                if (retryCountRef.current < retryCount) {
                    retryCountRef.current++;
                    console.log(`🔄 Reintentando... (${retryCountRef.current}/${retryCount})`);
                    
                    setTimeout(() => {
                        if (mountedRef.current) {
                            fetchData(forceRefresh);
                        }
                    }, retryDelay * retryCountRef.current);
                    
                    return;
                }
                
                setError(err.message || 'Error desconocido');
                
                if (onError) {
                    onError(err);
                }
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [apiFunction, data, immediate, onSuccess, onError, retryCount, retryDelay]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
        
        return () => {
            mountedRef.current = false;
        };
    }, dependencies);

    const refetch = useCallback(() => {
        fetchData(true);
    }, [fetchData]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
        setLastFetch(null);
        retryCountRef.current = 0;
    }, []);

    return { 
        data, 
        loading, 
        error, 
        refetch, 
        reset,
        lastFetch,
        isStale: lastFetch && (new Date() - lastFetch) > 300000 // 5 minutos
    };
};

/**
 * Hook para operaciones asíncronas manuales
 * @param {Object} options - Opciones del hook
 * @returns {Object} Estado y función de ejecución
 */
export const useAsyncOperation = (options = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    
    const { onSuccess = null, onError = null } = options;
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const execute = useCallback(async (operation) => {
        if (!mountedRef.current) return;
        
        try {
            setLoading(true);
            setError(null);
            
            console.log('🚀 Ejecutando operación asíncrona...');
            const result = await operation();
            
            if (mountedRef.current) {
                setData(result);
                
                if (onSuccess) {
                    onSuccess(result);
                }
                
                console.log('✅ Operación asíncrona completada');
                return result;
            }
        } catch (err) {
            console.error('❌ Error en operación asíncrona:', err);
            
            if (mountedRef.current) {
                setError(err.message || 'Error desconocido');
                
                if (onError) {
                    onError(err);
                }
            }
            throw err;
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [onSuccess, onError]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { loading, error, data, execute, reset };
};

/**
 * Hook especializado para estudiantes
 * @param {string} studentName - Nombre del estudiante
 * @returns {Object} Datos y operaciones del estudiante
 */
export const useStudent = (studentName) => {
    const [student, setStudent] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    
    const {
        data: studentData,
        loading: studentLoading,
        error: studentError,
        refetch: refetchStudent
    } = useApi(
        () => studentName ? apiService.getEstudiante(studentName) : Promise.resolve(null),
        [studentName],
        {
            immediate: !!studentName,
            onSuccess: (data) => {
                if (data && data.success) {
                    setStudent(data.data);
                }
            }
        }
    );

    const {
        data: recommendationsData,
        loading: recommendationsLoading,
        error: recommendationsError,
        refetch: refetchRecommendations
    } = useApi(
        () => studentName ? RecommendationService.getRecommendationsForStudent(studentName) : Promise.resolve([]),
        [studentName],
        {
            immediate: !!studentName,
            onSuccess: (data) => {
                setRecommendations(data || []);
            }
        }
    );

    const { execute: registerApproval, loading: registeringApproval } = useAsyncOperation({
        onSuccess: () => {
            console.log('✅ Aprobación registrada exitosamente');
            // Actualizar recomendaciones después del registro
            refetchRecommendations();
        }
    });

    const handleRegisterApproval = useCallback(async (professorName, courseCode) => {
        if (!studentName) throw new Error('Nombre de estudiante requerido');
        
        return registerApproval(() => 
            RecommendationService.registerCourseApproval(studentName, professorName, courseCode)
        );
    }, [studentName, registerApproval]);

    return {
        student,
        recommendations,
        studentLoading,
        recommendationsLoading,
        studentError,
        recommendationsError,
        registeringApproval,
        refetchStudent,
        refetchRecommendations,
        registerApproval: handleRegisterApproval
    };
};

/**
 * Hook especializado para profesores
 * @param {string} professorName - Nombre del profesor (opcional)
 * @returns {Object} Datos y operaciones de profesores
 */
export const useProfessor = (professorName = null) => {
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);

    const {
        data: professorsData,
        loading: professorsLoading,
        error: professorsError,
        refetch: refetchProfessors
    } = useApi(
        () => apiService.getProfesores(),
        [],
        {
            onSuccess: (data) => {
                if (data && data.success) {
                    setProfessors(data.data || []);
                }
            }
        }
    );

    const {
        data: professorData,
        loading: professorLoading,
        error: professorError,
        refetch: refetchProfessor
    } = useApi(
        () => professorName ? apiService.getProfesor(professorName) : Promise.resolve(null),
        [professorName],
        {
            immediate: !!professorName,
            onSuccess: (data) => {
                if (data && data.success) {
                    setSelectedProfessor(data.data);
                }
            }
        }
    );

    const { execute: createProfessor, loading: creatingProfessor } = useAsyncOperation({
        onSuccess: () => {
            refetchProfessors();
        }
    });

    const { execute: updateProfessor, loading: updatingProfessor } = useAsyncOperation({
        onSuccess: () => {
            refetchProfessors();
            if (professorName) {
                refetchProfessor();
            }
        }
    });

    const { execute: deleteProfessor, loading: deletingProfessor } = useAsyncOperation({
        onSuccess: () => {
            refetchProfessors();
        }
    });

    const handleCreateProfessor = useCallback(async (professorData) => {
        return createProfessor(() => apiService.createProfesor(professorData));
    }, [createProfessor]);

    const handleUpdateProfessor = useCallback(async (name, professorData) => {
        return updateProfessor(() => apiService.updateProfesor(name, professorData));
    }, [updateProfessor]);

    const handleDeleteProfessor = useCallback(async (name) => {
        return deleteProfessor(() => apiService.deleteProfesor(name));
    }, [deleteProfessor]);

    return {
        professors,
        selectedProfessor,
        professorsLoading,
        professorLoading,
        professorsError,
        professorError,
        creatingProfessor,
        updatingProfessor,
        deletingProfessor,
        refetchProfessors,
        refetchProfessor,
        createProfessor: handleCreateProfessor,
        updateProfessor: handleUpdateProfessor,
        deleteProfessor: handleDeleteProfessor
    };
};

/**
 * Hook para verificar el estado de salud de la API
 * @returns {Object} Estado de salud de la API
 */
export const useApiHealth = () => {
    const [isHealthy, setIsHealthy] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    const { 
        data, 
        loading, 
        error, 
        refetch 
    } = useApi(
        () => apiService.healthCheck(),
        [],
        {
            onSuccess: (data) => {
                setIsHealthy(data && data.success);
                setLastCheck(new Date());
            },
            onError: () => {
                setIsHealthy(false);
                setLastCheck(new Date());
            },
            retryCount: 1,
            retryDelay: 2000
        }
    );

    const checkHealth = useCallback(() => {
        refetch();
    }, [refetch]);

    // Verificar salud automáticamente cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            checkHealth();
        }, 300000); // 5 minutos

        return () => clearInterval(interval);
    }, [checkHealth]);

    return {
        isHealthy,
        loading,
        error,
        lastCheck,
        checkHealth,
        data
    };
};

/**
 * Hook para operaciones con cache
 * @param {string} key - Clave de cache
 * @param {Function} apiFunction - Función de API
 * @param {Object} options - Opciones de cache
 * @returns {Object} Datos con cache
 */
export const useApiCache = (key, apiFunction, options = {}) => {
    const { ttl = 300000 } = options; // 5 minutos por defecto
    const [cache, setCache] = useState(() => {
        try {
            const cached = localStorage.getItem(`api_cache_${key}`);
            if (cached) {
                const parsed = JSON.parse(cached);
                const now = new Date().getTime();
                if (now - parsed.timestamp < ttl) {
                    return parsed.data;
                }
            }
        } catch (error) {
            console.warn('Error leyendo cache:', error);
        }
        return null;
    });

    const { data, loading, error, refetch } = useApi(
        apiFunction,
        [],
        {
            immediate: !cache,
            onSuccess: (data) => {
                try {
                    localStorage.setItem(`api_cache_${key}`, JSON.stringify({
                        data,
                        timestamp: new Date().getTime()
                    }));
                    setCache(data);
                } catch (error) {
                    console.warn('Error guardando en cache:', error);
                }
            }
        }
    );

    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(`api_cache_${key}`);
            setCache(null);
        } catch (error) {
            console.warn('Error limpiando cache:', error);
        }
    }, [key]);

    return {
        data: cache || data,
        loading: !cache && loading,
        error,
        refetch,
        clearCache,
        fromCache: !!cache
    };
};