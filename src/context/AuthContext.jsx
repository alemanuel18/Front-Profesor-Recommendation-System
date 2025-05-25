import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          // Verificar si es un token mock o real
          const isMockToken = token.includes('fake-jwt-token');
          setIsUsingMockData(isMockToken);
          
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

  const login = async (credentials) => {
    try {
      // Primero intentar con la API real
      console.log('🔗 Intentando autenticación con API...');
      
      try {
        const loginData = {
          password: credentials.password
        };

        // Determinar si es carnet o email
        if (credentials.email.includes('@')) {
          loginData.email = credentials.email;
        } else {
          loginData.carnet = credentials.email;
        }
        
        const response = await apiService.makeRequest('/estudiantes/login', {
          method: 'POST',
          body: JSON.stringify(loginData),
        });
        
        if (response && response.success) {
          const userData = {
            id: response.data.carnet,
            name: response.data.nombre,
            role: "student", 
            email: response.data.email,
            carnet: response.data.carnet
          };
          
          // Persistir sesión REAL
          localStorage.setItem('authToken', `real-token-${Date.now()}`);
          localStorage.setItem('userId', userData.id);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userCarnet', userData.carnet);
          
          setCurrentUser(userData);
          setIsUsingMockData(false);
          console.log('✅ Autenticación exitosa con API REAL');
          return true;
        }
      } catch (apiError) {
        console.warn('⚠️ API no disponible:', apiError.message);
        
        // Solo permitir fallback si NO es error de credenciales
        if (apiError.message.includes('Credenciales inválidas') || 
            apiError.message.includes('401') ||
            apiError.message.includes('Unauthorized')) {
          throw new Error('Credenciales incorrectas');
        }
        
        // Si es error de conexión, permitir usar datos mock
        return await handleMockLogin(credentials);
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  const handleMockLogin = async (credentials) => {
    console.log('🔄 Usando datos de demostración (API no disponible)');
    
    if (credentials.email === "estudiante@uvg.edu.gt" && credentials.password === "password123") {
      const userData = {
        id: "mock-student-1",
        name: "JEREZ MELGAR, ALEJANDRO MANUEL",
        role: "student",
        email: credentials.email
      };
      
      localStorage.setItem('authToken', 'fake-jwt-token-student');
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userEmail', userData.email);
      
      setCurrentUser(userData);
      setIsUsingMockData(true);
      console.log('✅ Login con datos MOCK (estudiante)');
      return true;

    } else if (credentials.email === "admin@uvg.edu.gt" && credentials.password === "admin123") {
      const userData = {
        id: "mock-admin-1",
        name: "ADMINISTRADOR UVG",
        role: "admin",
        email: credentials.email
      };
      
      localStorage.setItem('authToken', 'fake-jwt-token-admin');
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userEmail', userData.email);
      
      setCurrentUser(userData);
      setIsUsingMockData(true);
      console.log('✅ Login con datos MOCK (admin)');
      return true;
    } else {
      throw new Error("Credenciales incorrectas");
    }
  };

  const verifyToken = async (token) => {
    try {
      return token && token.length > 0;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userCarnet');
    setCurrentUser(null);
    setIsUsingMockData(false);
  };

  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    isUsingMockData, // Nuevo: indica si se están usando datos mock
    isAdmin: () => hasRole('admin'),
    isStudent: () => hasRole('student'),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};