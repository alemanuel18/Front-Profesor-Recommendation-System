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
  
  async getEstudiantes() {
    return this.makeRequest('/estudiantes');
  }

  async getEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`);
  }

  async getEstudianteByName(nombre) {
    return this.makeRequest(`/estudiantes/nombre/${encodeURIComponent(nombre)}`);
  }

  async createEstudiante(estudianteData) {
    return this.makeRequest('/estudiantes', {
      method: 'POST',
      body: JSON.stringify(estudianteData),
    });
  }

  async updateEstudiante(carnet, estudianteData) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`, {
      method: 'PUT',
      body: JSON.stringify(estudianteData),
    });
  }

  async deleteEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}`, {
      method: 'DELETE',
    });
  }

  async getEstudiantesSimilares(nombre) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(nombre)}/similares`);
  }

  async loginEstudiante(credenciales) {
    return this.makeRequest('/estudiantes/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    });
  }

  // ===== GESTIÓN DE CURSOS PARA ESTUDIANTES =====

  async asignarEstudianteCurso(carnet, datosCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/asignar-curso`, {
      method: 'POST',
      body: JSON.stringify(datosCurso),
    });
  }

  async desasignarEstudianteCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/desasignar-curso/${encodeURIComponent(codigoCurso)}`, {
      method: 'DELETE',
    });
  }

  async getCursosEstudiante(carnet) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/cursos`);
  }

  async verificarInscripcionCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/curso/${encodeURIComponent(codigoCurso)}/inscripcion`);
  }

  async getProfesoresDisponiblesCurso(carnet, codigoCurso) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(carnet)}/curso/${encodeURIComponent(codigoCurso)}/profesores-disponibles`);
  }

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
        puede_cambiar_profesor: false,
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
  
  async getProfesores() {
    return this.makeRequest('/profesores');
  }

  async getProfesor(nombre) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`);
  }

  async createProfesor(profesorData) {
    return this.makeRequest('/profesores', {
      method: 'POST',
      body: JSON.stringify(profesorData),
    });
  }

  async updateProfesor(nombre, profesorData) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`, {
      method: 'PUT',
      body: JSON.stringify(profesorData),
    });
  }

  async deleteProfesor(nombre) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombre)}`, {
      method: 'DELETE',
    });
  }

  // ===== CURSOS =====

  async getCursos(departamento = null) {
    const params = departamento ? `?departamento=${encodeURIComponent(departamento)}` : '';
    return this.makeRequest(`/cursos${params}`);
  }

  async getCurso(codigo) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`);
  }

  async createCurso(cursoData) {
    return this.makeRequest('/cursos', {
      method: 'POST',
      body: JSON.stringify(cursoData),
    });
  }

  async updateCurso(codigo, cursoData) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(cursoData),
    });
  }

  async deleteCurso(codigo) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigo)}`, {
      method: 'DELETE',
    });
  }

  async getEstudiantesPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes`);
  }

  async inscribirEstudianteCurso(codigoCurso, carnetEstudiante) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}`, {
      method: 'POST',
    });
  }

  async desinscribirEstudianteCurso(codigoCurso, carnetEstudiante) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}`, {
      method: 'DELETE',
    });
  }

  async actualizarNotaEstudiante(codigoCurso, carnetEstudiante, notaData) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}/nota`, {
      method: 'PUT',
      body: JSON.stringify(notaData),
    });
  }

  async asignarCursoProfesor(nombreProfesor, codigoCurso) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos/${encodeURIComponent(codigoCurso)}`, {
      method: 'POST',
    });
  }

  async desasignarCursoProfesor(nombreProfesor, codigoCurso) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos/${encodeURIComponent(codigoCurso)}`, {
      method: 'DELETE',
    });
  }

  async getCursosProfesor(nombreProfesor) {
    return this.makeRequest(`/profesores/${encodeURIComponent(nombreProfesor)}/cursos`);
  }

  async getProfesoresPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/profesores`);
  }

  // ===== RECOMENDACIONES - MÉTODOS CORREGIDOS =====

  /**
   * Obtiene recomendaciones para un estudiante (usa el endpoint correcto)
   */
  async getRecomendaciones(nombreEstudiante, { limite = null, codigoCurso = null } = {}) {
    if (!nombreEstudiante || typeof nombreEstudiante !== 'string') {
      throw new Error('Se requiere un nombre de estudiante válido');
    }

    const params = new URLSearchParams();
    if (limite) params.append('limite', limite);
    if (codigoCurso) params.append('curso', codigoCurso);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    return this.makeRequest(`/recomendaciones/${encodeURIComponent(nombreEstudiante)}${queryString}`);
  }

  /**
   * Obtiene el porcentaje de recomendación específico entre estudiante y profesor
   */
  async getPorcentajeRecomendacion(nombreEstudiante, nombreProfesor) {
    return this.makeRequest(`/porcentaje/${encodeURIComponent(nombreEstudiante)}/${encodeURIComponent(nombreProfesor)}`);
  }

  /**
   * Obtiene recomendación específica entre estudiante y profesor
   */
  async getRecomendacionEspecifica(nombreEstudiante, nombreProfesor) {
    return this.makeRequest(`/recomendacion/${encodeURIComponent(nombreEstudiante)}/${encodeURIComponent(nombreProfesor)}`);
  }

  /**
   * Obtiene matriz de compatibilidad completa
   */
  async getMatrizCompatibilidad(nombreEstudiante, incluirTodos = false) {
    const params = incluirTodos ? '?incluir_todos=true' : '';
    return this.makeRequest(`/compatibilidad/${encodeURIComponent(nombreEstudiante)}${params}`);
  }

  /**
   * Obtiene estadísticas del algoritmo para un estudiante
   */
  async getEstadisticasAlgoritmo(nombreEstudiante) {
    return this.makeRequest(`/estadisticas/${encodeURIComponent(nombreEstudiante)}`);
  }

  /**
   * Registra aprobación de curso
   */
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