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

          return await response.json();
      } catch (error) {
          console.error('❌ Error en petición API:', {
              endpoint,
              url: `${API_BASE_URL}${endpoint}`,
              error: error.toString(),  // Mostrar solo el mensaje
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

  // Obtener un estudiante por nombre
  async getEstudiante(nombre) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(nombre)}`);
  }

  // Crear un nuevo estudiante
  async createEstudiante(estudianteData) {
    return this.makeRequest('/estudiantes', {
      method: 'POST',
      body: JSON.stringify(estudianteData),
    });
  }

  // Actualizar un estudiante
  async updateEstudiante(nombre, estudianteData) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(nombre)}`, {
      method: 'PUT',
      body: JSON.stringify(estudianteData),
    });
  }

  // Eliminar un estudiante
  async deleteEstudiante(nombre) {
    return this.makeRequest(`/estudiantes/${encodeURIComponent(nombre)}`, {
      method: 'DELETE',
    });
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

  // Obtener profesores de un curso específico
  async getProfesoresPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/profesores`);
  }

  // Obtener estudiantes de un curso específico
  async getEstudiantesPorCurso(codigoCurso) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes`);
  }

  // Inscribir estudiante a un curso
  async inscribirEstudianteCurso(codigoCurso, carnetEstudiante) {
    return this.makeRequest(`/cursos/${encodeURIComponent(codigoCurso)}/estudiantes/${encodeURIComponent(carnetEstudiante)}`, {
      method: 'POST',
    });
  }

  // Desinscribir estudiante de un curso
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
    return this.makeRequest('/health');
  }
}

// Exportar una instancia única del servicio
export default new ApiService();