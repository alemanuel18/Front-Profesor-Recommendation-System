// @ Front-Profesor-Recommendation-System
// @ File Name : RecommendationService.js
// @ Date : 21/05/2025
// @ Author : Marcelo Detlefsen

/**
 * Servicio de Recomendaciones
 * 
 * Este servicio maneja todas las operaciones relacionadas con el sistema de recomendaciones,
 * incluyendo la obtención de recomendaciones personalizadas y el registro de aprobaciones.
 */

import apiService from './apiService';

class RecommendationService {
  
  /**
   * Obtiene recomendaciones personalizadas para un estudiante
   * @param {string} studentName - Nombre del estudiante
   * @param {number|null} limit - Límite de recomendaciones a obtener
   * @returns {Promise<Array>} Lista de recomendaciones
   */
  async getRecommendationsForStudent(studentName, limit = null) {
    try {
      console.log(`🔍 Obteniendo recomendaciones para: ${studentName}`);
      
      const response = await apiService.getRecomendaciones(studentName, limit);
      
      if (response.success && response.data) {
        const recommendations = response.data.map(rec => ({
          id: rec.profesor_id || rec.nombre,
          professorName: rec.nombre || rec.profesor_nombre,
          compatibilityScore: rec.puntuacion_compatibilidad || rec.score || 0,
          department: rec.departamento || 'Sin especificar',
          teachingStyle: rec.estilo_enseñanza || 'Sin especificar',
          classStyle: rec.estilo_clase || 'Sin especificar',
          rating: rec.evaluacion_docente || 0,
          experience: rec.años_experiencia || 0,
          approvalRate: rec.porcentaje_aprobados || 0,
          availability: rec.disponibilidad || 0,
          totalScore: rec.puntuacion_total || 0,
          reasons: rec.razones_recomendacion || this.generateRecommendationReasons(rec),
          image: rec.imagen || "/api/placeholder/150/150"
        }));

        // Ordenar por puntuación de compatibilidad
        recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        
        console.log(`✅ Se obtuvieron ${recommendations.length} recomendaciones`);
        return recommendations;
      }
      
      console.warn('⚠️ No se encontraron recomendaciones, usando datos mock');
      return this.getMockRecommendations(studentName);
      
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones:', error);
      
      // En caso de error, devolver recomendaciones mock
      return this.getMockRecommendations(studentName);
    }
  }

  /**
   * Registra que un estudiante aprobó un curso con un profesor específico
   * @param {string} studentName - Nombre del estudiante
   * @param {string} professorName - Nombre del profesor
   * @param {string} courseCode - Código del curso
   * @returns {Promise<boolean>} True si se registró correctamente
   */
  async registerCourseApproval(studentName, professorName, courseCode) {
    try {
      console.log(`📝 Registrando aprobación: ${studentName} - ${professorName} - ${courseCode}`);
      
      const response = await apiService.registrarAprobacion(studentName, professorName, courseCode);
      
      if (response.success) {
        console.log('✅ Aprobación registrada exitosamente');
        return true;
      }
      
      console.warn('⚠️ Error en el registro de aprobación');
      return false;
      
    } catch (error) {
      console.error('❌ Error registrando aprobación:', error);
      throw new Error(`Error al registrar aprobación: ${error.message}`);
    }
  }

  /**
   * Obtiene profesores recomendados para un curso específico
   * @param {string} studentName - Nombre del estudiante
   * @param {string} courseCode - Código del curso
   * @param {number|null} limit - Límite de profesores a obtener
   * @returns {Promise<Array>} Lista de profesores recomendados para el curso
   */
  async getRecommendationsForCourse(studentName, courseCode, limit = null) {
    try {
      // Primero obtener todas las recomendaciones del estudiante
      const allRecommendations = await this.getRecommendationsForStudent(studentName);
      
      // Filtrar por curso si es necesario (esto dependería de cómo esté estructurada tu API)
      // Por ahora devolvemos todas las recomendaciones
      let courseRecommendations = allRecommendations;
      
      // Aplicar límite si se especifica
      if (limit && limit > 0) {
        courseRecommendations = courseRecommendations.slice(0, limit);
      }
      
      console.log(`📚 Recomendaciones para curso ${courseCode}: ${courseRecommendations.length}`);
      return courseRecommendations;
      
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones para curso:', error);
      return [];
    }
  }

  /**
   * Genera razones de recomendación basadas en los datos del profesor
   * @param {Object} professorData - Datos del profesor
   * @returns {Array<string>} Lista de razones de recomendación
   */
  generateRecommendationReasons(professorData) {
    const reasons = [];
    
    if (professorData.evaluacion_docente >= 4.5) {
      reasons.push("Excelente evaluación docente");
    }
    
    if (professorData.porcentaje_aprobados >= 80) {
      reasons.push("Alto porcentaje de aprobación");
    }
    
    if (professorData.años_experiencia >= 10) {
      reasons.push("Amplia experiencia docente");
    }
    
    if (professorData.estilo_enseñanza) {
      reasons.push(`Estilo de enseñanza compatible: ${professorData.estilo_enseñanza}`);
    }
    
    if (professorData.disponibilidad >= 30) {
      reasons.push("Buena disponibilidad horaria");
    }
    
    return reasons.length > 0 ? reasons : ["Profesor recomendado por el sistema"];
  }

  /**
   * Datos mock para desarrollo y fallback
   * @param {string} studentName - Nombre del estudiante
   * @returns {Array} Lista de recomendaciones mock
   */
  getMockRecommendations(studentName) {
    return [
      {
        id: "1",
        professorName: "DR. GONZALEZ LOPEZ, MARIA ELENA",
        compatibilityScore: 95.5,
        department: "Matemáticas",
        teachingStyle: "visual",
        classStyle: "teorica",
        rating: 4.8,
        experience: 12,
        approvalRate: 85,
        availability: 40,
        totalScore: 85.5,
        reasons: [
          "Estilo de enseñanza compatible con tu perfil",
          "Excelente evaluación docente (4.8/5)",
          "Alto porcentaje de aprobación (85%)"
        ],
        image: "/api/placeholder/150/150"
      },
      {
        id: "2",
        professorName: "DR. HERNANDEZ MORALES, LUIS FERNANDO",
        compatibilityScore: 92.3,
        department: "Matemáticas",
        teachingStyle: "visual",
        classStyle: "teorica",
        rating: 4.9,
        experience: 15,
        approvalRate: 90,
        availability: 25,
        totalScore: 92.3,
        reasons: [
          "Excelente puntuación general (92.3)",
          "Muy alta evaluación docente (4.9/5)",
          "Amplia experiencia (15 años)"
        ],
        image: "/api/placeholder/150/150"
      },
      {
        id: "3",
        professorName: "LIC. MARTINEZ FLORES, ANA SOFIA",
        compatibilityScore: 88.7,
        department: "Estadística",
        teachingStyle: "auditivo",
        classStyle: "mixta",
        rating: 4.6,
        experience: 6,
        approvalRate: 82,
        availability: 30,
        totalScore: 80.1,
        reasons: [
          "Clase mixta adecuada para tu estilo",
          "Buena disponibilidad horaria",
          "Buen porcentaje de aprobación"
        ],
        image: "/api/placeholder/150/150"
      }
    ];
  }

  /**
   * Verifica el estado de salud del servicio de recomendaciones
   * @returns {Promise<boolean>} True si el servicio está funcionando
   */
  async healthCheck() {
    try {
      const response = await apiService.healthCheck();
      return response.success;
    } catch (error) {
      console.error('❌ Error en health check:', error);
      return false;
    }
  }
}

// Exportar una instancia única del servicio
export default new RecommendationService();