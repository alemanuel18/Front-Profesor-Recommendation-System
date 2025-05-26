// @ Front-Profesor-Recommendation-System
// @ File Name : StudentContext.jsx
// @ Date : 21/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Contexto de Estudiante
 * 
 * Este archivo proporciona la gestión centralizada de datos del estudiante.
 * Se conecta con la API del backend para obtener información en tiempo real.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  // ===== ESTADOS DEL CONTEXTO =====
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  const { currentUser } = useAuth();

  // ===== FUNCIONES PARA MANEJAR ESTUDIANTE =====

  /**
   * Obtiene los datos del estudiante desde la API
   */
  const fetchStudentData = async (studentIdentifier) => {
    if (!studentIdentifier) return;
    
    setLoading(true);
    setError(null);
    try {
      let response = null;
      
      // Intentar obtener por diferentes métodos según el tipo de identificador
      try {
        // Si parece ser un carnet (número), usar el endpoint de carnet
        if (/^\d+$/.test(studentIdentifier)) {
          console.log(`🔍 Obteniendo estudiante por carnet: ${studentIdentifier}`);
          response = await apiService.getEstudiante(studentIdentifier);
        } else {
          // Si es texto, usar el endpoint de nombre
          console.log(`🔍 Obteniendo estudiante por nombre: ${studentIdentifier}`);
          response = await apiService.getEstudianteByName(studentIdentifier);
        }
      } catch (firstAttemptError) {
        // Si falla el primer intento, probar con el otro método
        console.warn('⚠️ Primer intento fallido, probando método alternativo');
        try {
          if (/^\d+$/.test(studentIdentifier)) {
            response = await apiService.getEstudianteByName(studentIdentifier);
          } else {
            response = await apiService.getEstudiante(studentIdentifier);
          }
        } catch (secondAttemptError) {
          console.error('❌ Ambos intentos de obtener datos fallaron');
          throw secondAttemptError;
        }
      }
      
      if (response && response.success && response.data) {
        const student = response.data;
        console.log('📊 Datos del estudiante obtenidos de la API:', student);
        
        setStudentData({
          id: student.id || student.carnet || student.carne,
          carne: student.carnet || student.carne,
          name: student.nombre || student.name,
          carrera: student.carrera,
          pensum: student.pensum,
          promedioCicloAnterior: student.promedio_ciclo_anterior || student.promedio,
          grado: student.grado,
          cargaMaxima: student.carga_maxima,
          estiloAprendizaje: student.estilo_aprendizaje,
          estiloClase: student.estilo_clase,
          horasEstudio: student.horas_estudio,
          participacionClase: student.participacion_clase,
          email: student.email,
          puntuacionTotal: student.puntuacion_total
        });
      } else {
        throw new Error('La API no devolvió datos válidos del estudiante');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err.message);
      // Solo usar datos mock si no tenemos datos reales del usuario
      if (!currentUser || !currentUser.name) {
        console.warn('⚠️ Usando datos mock debido a falta de información del usuario');
        setStudentData(getMockStudentData(studentIdentifier));
      } else {
        // No establecer datos mock si tenemos información real del usuario
        setStudentData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene recomendaciones de profesores para el estudiante
   */
  const fetchRecommendations = async (studentName, limit = null) => {
    if (!studentName) return [];
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getRecomendaciones(studentName, limit);
      if (response.success && response.data) {
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
        return mappedRecommendations;
      }
      return [];
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registra que un estudiante aprobó un curso con un profesor
   */
  const registerCourseApproval = async (studentName, professorName, courseCode) => {
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

  /**
   * Crea un nuevo estudiante
   */
  const createStudent = async (studentData) => {
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

  /**
   * Actualiza los datos del estudiante
   */
  const updateStudent = async (studentIdentifier, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateEstudiante(studentIdentifier, updateData);
      if (response.success) {
        await fetchStudentData(studentIdentifier); // Recargar los datos
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

  // ===== DATOS MOCK PARA DESARROLLO (solo usar cuando no hay datos reales) =====
  const getMockStudentData = (studentIdentifier) => {
    console.warn('⚠️ Usando datos mock - esto solo debería pasar en desarrollo sin conexión a API');
    return {
      id: studentIdentifier || "estudiante-demo",
      carne: /^\d+$/.test(studentIdentifier) ? studentIdentifier : "demo-001",
      name: studentIdentifier && !/^\d+$/.test(studentIdentifier) ? studentIdentifier : "ESTUDIANTE DEMO",
      carrera: "Ingeniería en Ciencias de la Computación",
      pensum: "2021",
      promedioCicloAnterior: 85.5,
      grado: "Segundo año",
      cargaMaxima: 18,
      estiloAprendizaje: "visual",
      estiloClase: "mixta",
      horasEstudio: 20,
      participacionClase: 8
    };
  };

  // ===== EFECTOS =====
  useEffect(() => {
    // Solo intentar cargar datos si tenemos un usuario autenticado con información válida
    if (currentUser) {
      // Priorizar carnet si está disponible, sino usar nombre
      const identifier = currentUser.carnet || currentUser.carne || currentUser.name;
      if (identifier) {
        console.log(`🔄 Usuario autenticado detectado, cargando datos para: ${identifier}`);
        fetchStudentData(identifier);
      } else {
        console.warn('⚠️ Usuario autenticado pero sin identificador válido (carnet/nombre)');
      }
    } else {
      console.log('👤 No hay usuario autenticado todavía');
      // Limpiar datos cuando no hay usuario
      setStudentData(null);
    }
  }, [currentUser]);

  // ===== FUNCIONES AUXILIARES =====
  const getDisplayValue = (contextValue, mockValue) => {
    // Si tenemos datos reales del contexto, usarlos; sino usar mock solo si no hay usuario real
    if (studentData && studentData[contextValue]) {
      return studentData[contextValue];
    }
    // Solo usar mock si no tenemos usuario real o datos reales
    if (!currentUser || !currentUser.name) {
      return mockValue;
    }
    return null;
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    studentData,
    loading,
    error,
    recommendations,
    fetchStudentData,
    fetchRecommendations,
    registerCourseApproval,
    createStudent,
    updateStudent,
    
    // Propiedades individuales para compatibilidad con componentes existentes
    // Estas ahora usan los datos reales cuando están disponibles
    id: getDisplayValue('id', currentUser?.carnet || currentUser?.carne || currentUser?.name),
    carne: getDisplayValue('carne', currentUser?.carnet || currentUser?.carne),
    name: getDisplayValue('name', currentUser?.name),
    carrera: getDisplayValue('carrera', 'Ingeniería en Ciencias de la Computación'),
    pensum: getDisplayValue('pensum', '2021'),
    promedioCicloAnterior: getDisplayValue('promedioCicloAnterior', 85.5),
    grado: getDisplayValue('grado', 'Segundo año'),
    cargaMaxima: getDisplayValue('cargaMaxima', 18)
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent debe ser usado dentro de un StudentProvider');
  }
  return context;
};