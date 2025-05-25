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
    return this.makeRequest(`/profesores/curso/${encodeURIComponent(codigoCurso)}`);
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