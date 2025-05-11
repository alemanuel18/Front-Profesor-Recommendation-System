// @ Front-Profesor-Recommendation-System
// @ File Name : AuthContext.jsx
// @ Date : 11/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678
// @ Modified : 11/05/2025
//

// Este archivo define el contexto global para la autenticación de usuarios.
// Proporciona un proveedor y hooks personalizados para gestionar la autenticación en toda la aplicación.
// Incluye soporte para roles de usuario (estudiante/admin)

import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto para la autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para guardar información del usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para controlar si la autenticación está en proceso
  const [loading, setLoading] = useState(true);

  // Simular la verificación del token al cargar la página
  useEffect(() => {
    const checkUserSession = () => {
      // Verificar si hay un token guardado en localStorage
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // En una implementación real, aquí verificaríamos el token con el backend
        // Por ahora, simplemente consideramos que existe un usuario si hay token
        setCurrentUser({ 
          // Valores simulados, en producción vendrían del backend
          id: localStorage.getItem('userId'),
          name: localStorage.getItem('userName'),
          role: localStorage.getItem('userRole') || 'student', // Nuevo campo para el rol
        });
      }
      
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      // En producción, aquí haríamos una petición al backend
      // Simulamos una respuesta exitosa para demostración
      
      // Validación simple (solo para demostración)
      if (credentials.email === "estudiante@uvg.edu.gt" && credentials.password === "password123") {
        const userData = {
          id: "1",
          name: "JEREZ MELGAR, ALEJANDRO MANUEL",
          role: "student", // Rol de estudiante
        };
        
        // Guardar datos en localStorage
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        
        setCurrentUser(userData);
        return true;
      } else if (credentials.email === "admin@uvg.edu.gt" && credentials.password === "admin123") {
        const userData = {
          id: "2",
          name: "ADMINISTRADOR UVG",
          role: "admin", // Rol de administrador
        };
        
        // Guardar datos en localStorage
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

  // Función para cerrar sesión
  const logout = () => {
    // Eliminar token y datos del usuario
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Valor del contexto que se proporcionará
  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAdmin: () => hasRole('admin'),
    isStudent: () => hasRole('student'),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};