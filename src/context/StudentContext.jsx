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
  const fetchStudentData = async (studentName) => {
    if (!studentName) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getEstudiante(studentName);
      if (response.success && response.data) {
        const student = response.data;
        setStudentData({
          id: student.id || "24678",
          carne: student.carne || "24678",
          name: student.nombre || studentName,
          carrera: student.carrera || "Ingeniería en Ciencias de la Computación",
          pensum: student.pensum || "2021",
          promedioCicloAnterior: student.promedio_ciclo_anterior || 85.5,
          grado: student.grado || "Segundo año",
          cargaMaxima: student.carga_maxima || 18,
          estiloAprendizaje: student.estilo_aprendizaje,
          estiloClase: student.estilo_clase,
          horasEstudio: student.horas_estudio,
          participacionClase: student.participacion_clase
        });
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err.message);
      // Cargar datos mock en caso de error
      setStudentData(getMockStudentData(studentName));
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
  const updateStudent = async (studentName, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateEstudiante(studentName, updateData);
      if (response.success) {
        await fetchStudentData(studentName); // Recargar los datos
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

  // ===== DATOS MOCK PARA DESARROLLO =====
  const getMockStudentData = (studentName) => ({
    id: "24678",
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

  // ===== EFECTOS =====
  useEffect(() => {
    if (currentUser && currentUser.name) {
      fetchStudentData(currentUser.name);
    }
  }, [currentUser]);

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    studentData: studentData || getMockStudentData(currentUser?.name),
    loading,
    error,
    recommendations,
    fetchStudentData,
    fetchRecommendations,
    registerCourseApproval,
    createStudent,
    updateStudent,
    // Propiedades individuales para compatibilidad con componentes existentes
    id: studentData?.id || "24678",
    carne: studentData?.carne || "24678", 
    name: studentData?.name || currentUser?.name || "JEREZ MELGAR, ALEJANDRO MANUEL",
    carrera: studentData?.carrera || "Ingeniería en Ciencias de la Computación",
    pensum: studentData?.pensum || "2021",
    promedioCicloAnterior: studentData?.promedioCicloAnterior || 85.5,
    grado: studentData?.grado || "Segundo año",
    cargaMaxima: studentData?.cargaMaxima || 18
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