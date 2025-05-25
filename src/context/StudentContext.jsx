import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dataSource, setDataSource] = useState('loading'); // 'api' | 'mock' | 'loading'
  
  const { currentUser, isUsingMockData } = useAuth();

  const fetchStudentData = async (studentName, forceUseMock = false) => {
    if (!studentName) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Si el usuario está usando datos mock o se fuerza el uso de mock
      if (isUsingMockData || forceUseMock) {
        console.log('👤 Cargando datos de estudiante MOCK');
        setStudentData(getMockStudentData(studentName));
        setDataSource('mock');
        return;
      }

      // Intentar obtener datos reales de la API
      console.log('🔗 Obteniendo datos de estudiante desde API...');
      const response = await apiService.getEstudiante(studentName);
      
      if (response.success && response.data) {
        const student = response.data;
        const realStudentData = {
          id: student.id || student.carne,
          carne: student.carne,
          name: studentName,
          carrera: student.carrera,
          pensum: student.pensum,
          promedioCicloAnterior: student.promedio_ciclo_anterior,
          grado: student.grado,
          cargaMaxima: student.carga_maxima,
          estiloAprendizaje: student.estilo_aprendizaje,
          estiloClase: student.estilo_clase,
          horasEstudio: student.horas_estudio,
          participacionClase: student.participacion_clase
        };
        
        setStudentData(realStudentData);
        setDataSource('api');
        console.log('✅ Datos de estudiante cargados desde API REAL');
      } else {
        throw new Error('No se encontraron datos del estudiante en la API');
      }
    } catch (err) {
      console.warn('⚠️ Error obteniendo datos de estudiante de API:', err.message);
      console.log('👤 Fallback a datos MOCK');
      setStudentData(getMockStudentData(studentName));
      setDataSource('mock');
      setError(`Usando datos de demostración. Error API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (studentName, limit = null, forceUseMock = false) => {
    if (!studentName) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      // Si estamos usando datos mock
      if (dataSource === 'mock' || forceUseMock) {
        console.log('🎯 Generando recomendaciones MOCK');
        const mockRecommendations = getMockRecommendations();
        setRecommendations(mockRecommendations);
        return mockRecommendations;
      }

      // Intentar obtener recomendaciones reales
      console.log('🔗 Obteniendo recomendaciones desde API...');
      const response = await apiService.getRecomendaciones(studentName, limit);
      
      if (response.success && response.data && response.data.length > 0) {
        const mappedRecommendations = response.data.map(rec => ({
          professorId: rec.profesor_id || rec.nombre,
          professorName: rec.nombre || rec.profesor_nombre,
          compatibilityScore: rec.puntuacion_compatibilidad || rec.score,
          department: rec.departamento,
          teachingStyle: rec.estilo_enseñanza,
          classStyle: rec.estilo_clase,
          rating: rec.evaluacion_docente,
          experience: rec.años_experiencia,
          approvalRate: rec.porcentaje_aprobados,
          reasons: rec.razones_recomendacion || []
        }));
        
        setRecommendations(mappedRecommendations);
        console.log('✅ Recomendaciones cargadas desde API REAL');
        return mappedRecommendations;
      } else {
        throw new Error('No se encontraron recomendaciones en la API');
      }
    } catch (err) {
      console.warn('⚠️ Error obteniendo recomendaciones de API:', err.message);
      console.log('🎯 Fallback a recomendaciones MOCK');
      const mockRecommendations = getMockRecommendations();
      setRecommendations(mockRecommendations);
      return mockRecommendations;
    } finally {
      setLoading(false);
    }
  };

  const registerCourseApproval = async (studentName, professorName, courseCode) => {
    if (dataSource === 'mock') {
      console.log('⚠️ Simulando registro de aprobación (modo demostración)');
      return true; // Simular éxito en modo mock
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.registrarAprobacion(studentName, professorName, courseCode);
      if (response.success) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error registering course approval:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    if (dataSource === 'mock') {
      throw new Error('No se puede crear estudiantes en modo demostración');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createEstudiante(studentData);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Error creating student:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (studentName, updateData) => {
    if (dataSource === 'mock') {
      throw new Error('No se puede actualizar estudiante en modo demostración');
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateEstudiante(studentName, updateData);
      if (response.success) {
        await fetchStudentData(studentName);
        return response.data;
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Datos mock mejorados
  const getMockStudentData = (studentName) => ({
    id: "mock-24678",
    carne: "24678",
    name: studentName || "JEREZ MELGAR, ALEJANDRO MANUEL",
    carrera: "Ingeniería en Ciencias de la Computación",
    pensum: "2021",
    promedioCicloAnterior: 85.5,
    grado: "Segundo año",
    cargaMaxima: 18,
    estiloAprendizaje: "visual",
    estiloClase: "mixta",
    horasEstudio: 20,
    participacionClase: 8
  });

  const getMockRecommendations = () => [
    {
      professorId: "DR. GONZALEZ LOPEZ, MARIA ELENA",
      professorName: "DR. GONZALEZ LOPEZ, MARIA ELENA",
      compatibilityScore: 92.5,
      department: "Matemáticas",
      teachingStyle: "visual",
      classStyle: "teorica",
      rating: 4.8,
      experience: 12,
      approvalRate: 85,
      reasons: ["Estilo de enseñanza compatible", "Alta tasa de aprobación", "Experiencia en el área"]
    },
    {
      professorId: "DR. HERNANDEZ MORALES, LUIS FERNANDO",
      professorName: "DR. HERNANDEZ MORALES, LUIS FERNANDO",
      compatibilityScore: 88.3,
      department: "Matemáticas",
      teachingStyle: "visual",
      classStyle: "teorica",
      rating: 4.9,
      experience: 15,
      approvalRate: 90,
      reasons: ["Excelente evaluación docente", "Método visual compatible", "Gran experiencia"]
    },
    {
      professorId: "LIC. MARTINEZ FLORES, ANA SOFIA",
      professorName: "LIC. MARTINEZ FLORES, ANA SOFIA",
      compatibilityScore: 82.1,
      department: "Estadística",
      teachingStyle: "auditivo",
      classStyle: "mixta",
      rating: 4.6,
      experience: 6,
      approvalRate: 82,
      reasons: ["Clase mixta compatible", "Buena tasa de aprobación", "Enfoque práctico"]
    }
  ];

  useEffect(() => {
    if (currentUser && currentUser.name) {
      fetchStudentData(currentUser.name);
    }
  }, [currentUser, isUsingMockData]); // Recargar cuando cambie el usuario o el modo de datos

  // Datos actuales con fallback
  const currentStudentData = studentData || getMockStudentData(currentUser?.name);

  const value = {
    studentData: currentStudentData,
    loading,
    error,
    recommendations,
    dataSource, // Nuevo: indica la fuente de datos
    fetchStudentData,
    fetchRecommendations,
    registerCourseApproval,
    createStudent,
    updateStudent,
    isUsingMockData: dataSource === 'mock', // Helper para componentes
    
    // Propiedades individuales para compatibilidad
    id: currentStudentData?.id,
    carne: currentStudentData?.carne,
    name: currentStudentData?.name,
    carrera: currentStudentData?.carrera,
    pensum: currentStudentData?.pensum,
    promedioCicloAnterior: currentStudentData?.promedioCicloAnterior,
    grado: currentStudentData?.grado,
    cargaMaxima: currentStudentData?.cargaMaxima
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context;
};