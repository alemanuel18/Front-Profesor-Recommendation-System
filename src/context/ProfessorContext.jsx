import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const ProfessorContext = createContext();

export const ProfessorProvider = ({ children }) => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading'); // 'api' | 'mock' | 'loading'
  
  const { isUsingMockData } = useAuth();

  const fetchProfessors = async (forceUseMock = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si el usuario está usando datos mock o se fuerza el uso de mock
      if (isUsingMockData || forceUseMock) {
        console.log('📚 Cargando profesores MOCK');
        setProfessors(getMockProfessors());
        setDataSource('mock');
        return;
      }

      // Intentar obtener datos reales de la API
      console.log('🔗 Obteniendo profesores desde API...');
      const response = await apiService.getProfesores();
      
      if (response.success && response.data && response.data.length > 0) {
        const mappedProfessors = response.data.map(prof => ({
          id: prof.nombre,
          name: prof.nombre,
          department: prof.departamento || 'Departamento no especificado',
          specialties: prof.especialidades || ['Sin especialidades'],
          rating: prof.evaluacion_docente || 0,
          image: prof.imagen || "/api/placeholder/150/150",
          courses: prof.cursos || [],
          teachingStyle: prof.estilo_enseñanza,
          classStyle: prof.estilo_clase,
          experience: prof.años_experiencia,
          approvalRate: prof.porcentaje_aprobados,
          availability: prof.disponibilidad,
          totalScore: prof.puntuacion_total
        }));
        
        setProfessors(mappedProfessors);
        setDataSource('api');
        console.log('✅ Profesores cargados desde API REAL');
      } else {
        throw new Error('No se encontraron profesores en la API');
      }
    } catch (err) {
      console.warn('⚠️ Error obteniendo profesores de API:', err.message);
      console.log('📚 Fallback a datos MOCK');
      setProfessors(getMockProfessors());
      setDataSource('mock');
      setError(`Usando datos de demostración. Error API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getProfessorById = (professorId) => {
    return professors.find(prof => prof.id === professorId);
  };

  const createProfessor = async (professorData) => {
    if (dataSource === 'mock') {
      throw new Error('No se puede crear profesores en modo demostración');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createProfesor(professorData);
      if (response.success) {
        await fetchProfessors();
        return response.data;
      }
    } catch (err) {
      console.error('Error creating professor:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfessor = async (professorId, updateData) => {
    if (dataSource === 'mock') {
      throw new Error('No se puede actualizar profesores en modo demostración');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateProfesor(professorId, updateData);
      if (response.success) {
        await fetchProfessors();
        return response.data;
      }
    } catch (err) {
      console.error('Error updating professor:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProfessorsByCourse = async (courseCode) => {
    try {
      if (dataSource === 'mock') {
        // Filtrar profesores mock por curso
        return professors.filter(prof => 
          prof.courses.some(course => 
            course.toLowerCase().includes(courseCode.toLowerCase())
          )
        );
      }

      const response = await apiService.getProfesoresPorCurso(courseCode);
      if (response.success && response.data) {
        return response.data.map(prof => ({
          id: prof.nombre,
          name: prof.nombre,
          department: prof.departamento || 'Departamento no especificado',
          rating: prof.evaluacion_docente || 0,
          image: prof.imagen || "/api/placeholder/150/150",
          teachingStyle: prof.estilo_enseñanza,
          classStyle: prof.estilo_clase,
          totalScore: prof.puntuacion_total
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching professors by course:', err);
      return [];
    }
  };

  // Datos mock mejorados
  const getMockProfessors = () => [
    {
      id: "DR. GONZALEZ LOPEZ, MARIA ELENA",
      name: "DR. GONZALEZ LOPEZ, MARIA ELENA",
      department: "Matemáticas",
      specialties: ["Cálculo", "Álgebra Lineal", "Estadística"],
      rating: 4.8,
      image: "/api/placeholder/150/150",
      courses: ["Cálculo 1", "Álgebra Lineal 1"],
      teachingStyle: "visual",
      classStyle: "teorica",
      experience: 12,
      approvalRate: 85,
      availability: 40,
      totalScore: 85.5
    },
    {
      id: "ING. RODRIGUEZ CASTRO, CARLOS ALBERTO",
      name: "ING. RODRIGUEZ CASTRO, CARLOS ALBERTO",
      department: "Ingeniería",
      specialties: ["Programación", "Algoritmos", "Bases de Datos"],
      rating: 4.5,
      image: "/api/placeholder/150/150",
      courses: ["Programación 1", "Estructuras de Datos"],
      teachingStyle: "kinestesico",
      classStyle: "practica",
      experience: 8,
      approvalRate: 78,
      availability: 35,
      totalScore: 78.2
    },
    {
      id: "LIC. MARTINEZ FLORES, ANA SOFIA",
      name: "LIC. MARTINEZ FLORES, ANA SOFIA",
      department: "Estadística",
      specialties: ["Estadística Descriptiva", "Probabilidad", "Análisis de Datos"],
      rating: 4.6,
      image: "/api/placeholder/150/150",
      courses: ["Estadística 1", "Probabilidad y Estadística"],
      teachingStyle: "auditivo",
      classStyle: "mixta",
      experience: 6,
      approvalRate: 82,
      availability: 30,
      totalScore: 80.1
    },
    {
      id: "DR. HERNANDEZ MORALES, LUIS FERNANDO",
      name: "DR. HERNANDEZ MORALES, LUIS FERNANDO",
      department: "Matemáticas",
      specialties: ["Cálculo Avanzado", "Ecuaciones Diferenciales"],
      rating: 4.9,
      image: "/api/placeholder/150/150",
      courses: ["Cálculo 2", "Cálculo 3"],
      teachingStyle: "visual",
      classStyle: "teorica",
      experience: 15,
      approvalRate: 90,
      availability: 25,
      totalScore: 92.3
    },
    {
      id: "ING. VARGAS CRUZ, PATRICIA ISABEL",
      name: "ING. VARGAS CRUZ, PATRICIA ISABEL",
      department: "Ingeniería",
      specialties: ["Álgebra", "Matemáticas Discretas"],
      rating: 4.3,
      image: "/api/placeholder/150/150",
      courses: ["Álgebra Lineal 1", "Matemáticas Discretas"],
      teachingStyle: "kinestesico",
      classStyle: "practica",
      experience: 5,
      approvalRate: 75,
      availability: 45,
      totalScore: 75.8
    }
  ];

  useEffect(() => {
    fetchProfessors();
  }, [isUsingMockData]); // Recargar cuando cambie el modo de datos

  const value = {
    professors,
    loading,
    error,
    dataSource, // Nuevo: indica la fuente de datos
    fetchProfessors,
    getProfessorById,
    createProfessor,
    updateProfessor,
    getProfessorsByCourse,
    isUsingMockData: dataSource === 'mock' // Helper para componentes
  };

  return (
    <ProfessorContext.Provider value={value}>
      {children}
    </ProfessorContext.Provider>
  );
};

export const useProfessor = () => {
  const context = useContext(ProfessorContext);
  if (context === undefined) {
    throw new Error('useProfessor debe ser usado dentro de un ProfessorProvider');
  }
  return context;
};