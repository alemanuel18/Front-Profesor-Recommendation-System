const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  // Método genérico para hacer peticiones HTTP
  async makeRequest(endpoint, options = {}) {
      try {
          const url = `${API_BASE_URL}${endpoint}`;
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  ...options.headers,
              },
              ...options,
          };

          console.log(`🌐 Realizando petición: ${config.method || 'GET'} ${url}`);
          
          const response = await fetch(url, config);
          
          if (!response.ok) {
              let errorData;
              try {
                  errorData = await response.json();
              } catch (e) {
                  errorData = await response.text();
              }
              
              const errorMessage = errorData?.message || 
                                errorData?.detail || 
                                `Error HTTP: ${response.status}`;
              throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log(`✅ Respuesta exitosa de ${endpoint}:`, result);
          return result;
      } catch (error) {
          console.error('❌ Error en petición API:', {
              endpoint,
              url: `${API_BASE_URL}${endpoint}`,
              error: error.toString(),
              stack: error.stack
          });
          throw error;
      }
  }

  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyToken(token) {
    return this.makeRequest('/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  // ===== ESTUDIANTES =====
  
  // Obtener todos los estudiantes
  async getEstudiantes() {
    return this.makeRequest('/estudiantes');
  }

  // Obtener un estudiante por carnet
  async getEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`);
  }

  // Obtener un estudiante por nombre (nuevo método)
  async getEstudianteByName(nombre) {
    return this.makeRequest(`/estudiantes/nombre/${encodeURIComponent(nombre)}`);
  }

  // Crear un nuevo estudiante
  async createEstudiante(estudianteData) {
    return this.makeRequest('/estudiantes', {
      method: 'POST',
      body: JSON.stringify(estudianteData),
    });
  }

  // Actualizar un estudiante
  async updateEstudiante(carnet, estudianteData) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`, {
      method: 'PUT',
      body: JSON.stringify(estudianteData),
    });
  }

  // Eliminar un estudiante
  async deleteEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`, {
      method: 'DELETE',
    });
  }

  // Obtener estudiantes similares
  async getEstudiantesSimilares(nombre) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(nombre)}/similares`);
  }

  // Login de estudiante
  async loginEstudiante(credenciales) {
    return this.makeRequest('/estudiantes/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    });
  }

  // ===== GESTIÓN DE CURSOS PARA ESTUDIANTES =====

  // Asignar estudiante a un curso con profesor específico
  async asignarEstudianteCurso(carnet, datosCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/asignar-curso`, {
      method: 'POST',
      body: JSON.stringify(datosCurso),
    });
  }

  // Desasignar estudiante de un curso
  async desasignarEstudianteCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/desasignar-curso/${encodeURIComponent(codigoCurso)}`, {
      method: 'DELETE',
    });
  }

  // Obtener todos los cursos de un estudiante
  async getCursosEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/cursos`);
  }

  // NUEVOS MÉTODOS PARA LA RESTRICCIÓN DE UN PROFESOR POR CURSO

  // Verificar si un estudiante está inscrito en un curso específico
  async verificarInscripcionCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/curso/${encodeURIComponent(codigoCurso)}/inscripcion`);
  }

  // Obtener profesores disponibles para un curso específico
  async getProfesoresDisponiblesCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/curso/${encodeURIComponent(codigoCurso)}/profesores-disponibles`);
  }

  // Método helper para verificar si un estudiante puede inscribirse en un curso
  async puedeInscribirseEnCurso(carnet, codigoCurso) {
    try {
      const inscripcion = await this.verificarInscripcionCurso(carnet, codigoCurso);
      return {
        puede_inscribirse: !inscripcion.inscrito,
        profesor_actual: inscripcion.inscrito ? inscripcion.data.profesor : null,
        mensaje: inscripcion.inscrito 
          ? `Ya inscrito con el profesor ${inscripcion.data.profesor}`
          : 'Puede inscribirse en este curso'
      };
    } catch (error) {
      console.error('Error verificando inscripción:', error);
      throw error;
    }
  }

  // Método helper para obtener información completa de inscripción
  async getInformacionInscripcion(carnet, codigoCurso) {
    try {
      const [inscripcion, profesoresDisponibles] = await Promise.all([
        this.verificarInscripcionCurso(carnet, codigoCurso),
        this.getProfesoresDisponiblesCurso(carnet, codigoCurso)
      ]);

      return {
        esta_inscrito: inscripcion.inscrito,
        datos_inscripcion: inscripcion.data,
        profesores_disponibles: profesoresDisponibles.data.profesores,
        profesor_actual: inscripcion.inscrito ? inscripcion.data.profesor : null,
        puede_cambiar_profesor: false, // Siempre false según la nueva lógica
        mensaje: inscripcion.inscrito 
          ? `Inscrito con ${inscripcion.data.profesor}. No se puede cambiar de profesor.`
          : 'No inscrito. Puede elegir cualquier profesor disponible.'
      };
    } catch (error) {
      console.error('Error obteniendo información de inscripción:', error);
      throw error;
    }
  }

  // ===== PROFESORES =====
  
  // Obtener todos los profesores
  async getProfesores() {
    return this.makeRequest('/profesores');
  }

  // Obtener un profesor por nombre
  async getProfesor(nombre) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`);
  }

  // Crear un nuevo profesor
  async createProfesor(profesorData) {
    return this.makeRequest('/profesores', {
      method: 'POST',
      body: JSON.stringify(profesorData),
    });
  }

  // Actualizar un profesor
  async updateProfesor(nombre, profesorData) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`, {
      method: 'PUT',
      body: JSON.stringify(profesorData),
    });
  }

  // Eliminar un profesor
  async deleteProfesor(nombre) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`, {
      method: 'DELETE',
    });
  }

  // Obtener profesores por curso
  async getProfesoresPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/profesores`);
  }

  // ===== CURSOS =====

  // Obtener todos los cursos
  async getCursos(departamento = null) {
    const params = departamento ? `?departamento=${encodeURIComponent(departamento)}` : '';
    return this.makeRequest(`/cursos${params}`);
  }

  // Obtener un curso por código
  async getCurso(codigo) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`);
  }

  // Crear un nuevo curso
  async createCurso(cursoData) {
    return this.makeRequest('/cursos', {
      method: 'POST',
      body: JSON.stringify(cursoData),
    });
  }

  // Actualizar un curso
  async updateCurso(codigo, cursoData) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(cursoData),
    });
  }

  // Eliminar un curso
  async deleteCurso(codigo) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`, {
      method: 'DELETE',
    });
  }

  // Obtener estudiantes de un curso específico
  async getEstudiantesPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes`);
  }

  // Inscribir estudiante a un curso (método original mantenido para compatibilidad)
  async inscribirEstudianteCurso(codigoCurso, carnetEstudiante) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}`, {
      method: 'POST',
    });
  }

  // Desinscribir estudiante de un curso (método original mantenido para compatibilidad)
  async desinscribirEstudianteCurso(codigoCurso, carnetEstudiante) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}`, {
      method: 'DELETE',
    });
  }

  // Actualizar nota de estudiante en un curso
  async actualizarNotaEstudiante(codigoCurso, carnetEstudiante, notaData) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}/nota`, {
      method: 'PUT',
      body: JSON.stringify(notaData),
    });
  }

  // Asignar curso a profesor
  async asignarCursoProfesor(nombreProfesor, codigoCurso) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos/${encodeURIComponent(codigoCurso)}`, {
      method: 'POST',
    });
  }

  // Desasignar curso de profesor
  async desasignarCursoProfesor(nombreProfesor, codigoCurso) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos/${encodeURIComponent(codigoCurso)}`, {
      method: 'DELETE',
    });
  }

  // Obtener cursos de un profesor específico
  async getCursosProfesor(nombreProfesor) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos`);
  }

  // ===== RECOMENDACIONES =====
  
  // Obtener recomendaciones para un estudiante
  async getRecomendaciones(nombreEstudiante, limite = null) {
    const params = limite ? `?limite=${limite}` : '';
    return this.makeRequest(`/recomendaciones/${encodeURIComponent(nombreEstudiante)}${params}`);
  }

  // Registrar aprobación de curso
  async registrarAprobacion(nombreEstudiante, nombreProfesor, codigoCurso) {
    return this.makeRequest('/aprobacion', {
      method: 'POST',
      body: JSON.stringify({
        nombre_estudiante: nombreEstudiante,
        nombre_profesor: nombreProfesor,
        codigo_curso: codigoCurso,
      }),
    });
  }

  // ===== UTILIDADES =====
  
  // Verificar estado de la API
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return {
        success: true,
        ...response
      };
    } catch (error) {
      console.warn('⚠️ Health check falló:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Exportar una instancia única del servicio
export default new ApiService();