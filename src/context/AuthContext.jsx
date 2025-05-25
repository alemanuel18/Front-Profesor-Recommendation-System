// @ Front-Profesor-Recommendation-System
// @ File Name : AuthContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel, Marcelo Detlefsen
// @ Modified : 25/05/2025

/**
 * Contexto de Autenticación
 * 
 * Este archivo proporciona la gestión centralizada de autenticación para la aplicación.
 * Características principales:
 * - Manejo de sesión de usuario
 * - Control de roles (estudiante/administrador) obtenidos de la API
 * - Persistencia de sesión usando localStorage
 * - Funciones de login/logout
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService'; // Importa el servicio de API para autenticación

// Crear el contexto para la autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ===== ESTADOS DEL CONTEXTO =====
  const [currentUser, setCurrentUser] = useState(null); // Almacena datos del usuario actual
  const [loading, setLoading] = useState(true); // Control del estado de carga inicial

  // ===== EFECTOS =====
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          setCurrentUser({ 
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole') || 'student',
            email: localStorage.getItem('userEmail'),
            carnet: localStorage.getItem('userCarnet')
          });
        } else {
          logout();
        }
      }
      
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // ===== FUNCIONES DE AUTENTICACIÓN =====
  
  /**
   * Función para determinar el rol del usuario
   * @param {Object} userData - Datos del usuario de la API
   * @returns {string} - rol del usuario ('admin' o 'student')
   */
  const determineUserRole = (userData) => {
    // Opción 1: El backend devuelve el rol directamente
    if (userData.role) {
      return userData.role;
    }
    
    // Opción 2: El backend devuelve un campo isAdmin
    if (userData.isAdmin === true) {
      return 'admin';
    }
    
    // Opción 3: Basado en el email (si es @admin.uvg.edu.gt)
    if (userData.email && userData.email.includes('@admin.uvg')) {
      return 'admin';
    }
    
    // Opción 4: Basado en carnet específico (ejemplo: carnets que empiecen con 99999)
    if (userData.carnet && userData.carnet.startsWith('99999')) {
      return 'admin';
    }
    
    // Opción 5: Lista de carnets de administradores
    const adminCarnets = ['77777', '99999', '00000']; // Agrega los carnets de admin
    if (userData.carnet && adminCarnets.includes(userData.carnet)) {
      return 'admin';
    }
    
    // Por defecto, es estudiante
    return 'student';
  };

  /**
   * Función de inicio de sesión
   * Valida credenciales y establece la sesión del usuario
   * @param {Object} credentials - Credenciales del usuario (email, password)
   */
  const login = async (credentials) => {
    try {
      // Intentar autenticación con la API real primero
      try {
        console.log('🔗 Intentando autenticación con API...');
        
        // Preparar credenciales para la API del backend
        const loginData = {
          password: credentials.password
        };

        // Determinar si es carnet o email
        if (credentials.email.includes('@')) {
          loginData.email = credentials.email;
        } else {
          loginData.carnet = credentials.email; // Si no tiene @, asumimos que es carnet
        }
        
        // Hacer la petición a la API de estudiantes (login)
        const response = await apiService.makeRequest('/estudiantes/login', {
          method: 'POST',
          body: JSON.stringify(loginData),
        });
        
        // Si la API responde exitosamente
        if (response && response.success) {
          // Determinar el rol del usuario basado en los datos de la API
          const userRole = determineUserRole(response.data);
          
          const userData = {
            id: response.data.carnet,
            name: response.data.nombre,
            role: userRole, // Usar el rol determinado por la función
            email: response.data.email,
            carnet: response.data.carnet
          };
          
          // Persistir sesión en localStorage
          localStorage.setItem('authToken', 'neo4j-auth-token');
          localStorage.setItem('userId', userData.id);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userCarnet', userData.carnet);
          
          setCurrentUser(userData);
          console.log(`✅ Autenticación exitosa con API - Rol: ${userRole}`);
          return true;
        }
      } catch (apiError) {
        console.warn('⚠️ API no disponible o credenciales incorrectas:', apiError.message);
        
        // Si el error es de credenciales (401), no intentar fallback
        if (apiError.message.includes('Credenciales inválidas') || 
            apiError.message.includes('401')) {
          throw new Error('Credenciales incorrectas');
        }
      }

      // Si la API falla por conexión, usar credenciales de demostración
      if (credentials.email === "estudiante@uvg.edu.gt" && credentials.password === "password123") {
        // Datos de usuario estudiante
        const userData = {
          id: "1",
          name: "JEREZ MELGAR, ALEJANDRO MANUEL",
          role: "student",
          email: credentials.email
        };
        
        // Persistir sesión en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        
        setCurrentUser(userData);
        console.log('✅ Login exitoso con credenciales de demostración (estudiante)');
        return true;

      } else if (credentials.email === "admin@uvg.edu.gt" && credentials.password === "admin123") {
        // Datos de usuario administrador
        const userData = {
          id: "77777",
          name: "ADMINISTRADOR UVG",
          role: "admin",
          email: credentials.email,
          carnet: "77777"
        };
        
        // Persistir sesión en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token-admin');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userCarnet', userData.carnet);
        
        setCurrentUser(userData);
        console.log('✅ Login exitoso con credenciales de demostración (admin)');
        return true;
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    }
  };

  /**
   * Verifica si un token de autenticación es válido
   */
  const verifyToken = async (token) => {
    try {
      // Si tienes un endpoint para verificar tokens, úsalo aquí
      // const response = await apiService.verifyToken(token);
      // return response && response.success;
      
      // Como no tienes endpoint de verify en el backend, simular validación
      return token && token.length > 0;
    } catch (error) {
      return false;
    }
  };

  /**
   * Función de cierre de sesión
   * Elimina todos los datos de sesión
   */
  const logout = () => {
    // Limpiar datos de localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userCarnet');
    setCurrentUser(null);
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} - true si el usuario tiene el rol especificado
   */
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Objeto con valores y funciones disponibles en el contexto
  const value = {
    currentUser,     // Datos del usuario actual
    login,          // Función de inicio de sesión
    logout,         // Función de cierre de sesión
    loading,        // Estado de carga
    isAdmin: () => hasRole('admin'),    // Verificador de rol admin
    isStudent: () => hasRole('student'), // Verificador de rol estudiante
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Renderiza los hijos solo cuando la carga inicial termina */}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};