// @ Front-Profesor-Recommendation-System
// @ File Name : AuthContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
// @ Modified : 11/05/2025

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

// Crear el contexto para la autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ===== ESTADOS DEL CONTEXTO =====
  const [currentUser, setCurrentUser] = useState(null); // Almacena datos del usuario actual
  const [loading, setLoading] = useState(true); // Control del estado de carga inicial

  // ===== EFECTOS =====
  useEffect(() => {
    // Verificar si existe una sesión activa al cargar la aplicación
    const checkUserSession = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Recuperar datos de sesión del localStorage
        setCurrentUser({ 
          id: localStorage.getItem('userId'),
          name: localStorage.getItem('userName'),
          role: localStorage.getItem('userRole') || 'student',
        });
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
      // Validación de credenciales (simulada)
      if (credentials.email === "estudiante@uvg.edu.gt" && credentials.password === "password123") {
        // Datos de usuario estudiante
        const userData = {
          id: "1",
          name: "JEREZ MELGAR, ALEJANDRO MANUEL",
          role: "student",
        };
        
        // Persistir sesión en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        
        setCurrentUser(userData);
        return true;
      } else if (credentials.email === "admin@uvg.edu.gt" && credentials.password === "admin123") {
        // Datos de usuario administrador
        const userData = {
          id: "2",
          name: "ADMINISTRADOR UVG",
          role: "admin",
        };
        
        // Persistir sesión en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token-admin');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        
        setCurrentUser(userData);
        return true;
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      throw error;
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