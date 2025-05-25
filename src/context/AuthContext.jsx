// @ Front-Profesor-Recommendation-System
// @ File Name : AuthContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel, Marcelo Detlefsen
// @ Modified : 24/05/2025

/**
 * Contexto de Autenticación
 * 
 * Este archivo proporciona la gestión centralizada de autenticación para la aplicación.
 * Características principales:
 * - Manejo de sesión de usuario
 * - Control de roles (estudiante/administrador)
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
            email: localStorage.getItem('userEmail')
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
        // El backend espera carnet o email en el login
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
          const userData = {
            id: response.data.carnet,
            name: response.data.nombre,
            role: "student", 
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
          console.log('✅ Autenticación exitosa con API');
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
          id: "2",
          name: "ADMINISTRADOR UVG",
          role: "admin",
          email: credentials.email
        };
        
        // Persistir sesión en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token-admin');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        
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