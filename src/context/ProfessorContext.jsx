// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorContext.jsx
// @ Date : 21/05/2025
// @ Author : Alejandro Jerez, Marcelo Detlefsen

/**
 * Contexto de Profesores
 * 
 * Este archivo proporciona la gestión centralizada de datos de profesores.
 * Se conecta con la API del backend para obtener información en tiempo real.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ProfessorContext = createContext();

export const ProfessorProvider = ({ children }) => {
  // ===== ESTADOS DEL CONTEXTO =====
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== FUNCIONES PARA MANEJAR PROFESORES =====

  /**
   * Obtiene todos los profesores desde la API
   */
  const fetchProfessors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getProfesores();
      if (response.success && response.data) {
        // Mapear los datos de la API al formato esperado por el frontend
        const mappedProfessors = response.data.map(prof => ({
          id: prof.nombre, // Usando nombre como ID único
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
      }
    } catch (err) {
      console.error('Error fetching professors:', err);
      setError(err.message);
      // Cargar datos mock en caso de error
      setProfessors(getMockProfessors());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene un profesor específico por ID
   */
  const getProfessorById = (professorId) => {
    return professors.find(prof => prof.id === professorId);
  };

  /**
   * Crea un nuevo profesor
   */
  const createProfessor = async (professorData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createProfesor(professorData);
      if (response.success) {
        await fetchProfessors(); // Recargar la lista
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

  /**
   * Actualiza un profesor existente
   */
  const updateProfessor = async (professorId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateProfesor(professorId, updateData);
      if (response.success) {
        await fetchProfessors(); // Recargar la lista
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

  /**
   * Obtiene profesores que imparten un curso específico
   */
  const getProfessorsByCourse = async (courseCode) => {
    try {
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

  // ===== DATOS MOCK PARA DESARROLLO =====
  const getMockProfessors = () => [
    {
      id: "1",
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
      id: "2", 
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
      id: "3",
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
      id: "4",
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
      id: "5",
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

  // ===== EFECTOS =====
  useEffect(() => {
    fetchProfessors();
  }, []);

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    professors,
    loading,
    error,
    fetchProfessors,
    getProfessorById,
    createProfessor,
    updateProfessor,
    getProfessorsByCourse
  };

  return (
    <ProfessorContext.Provider value={value}>
      {children}
    </ProfessorContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProfessor = () => {
  const context = useContext(ProfessorContext);
  if (context === undefined) {
    throw new Error('useProfessor debe ser usado dentro de un ProfessorProvider');
  }
  return context;
};