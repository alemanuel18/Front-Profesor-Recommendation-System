import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Materias from './pages/Materias';
import Seleccion_Profesores from './pages/Seleccion_Profesores';
import Login from './pages/Login';
import { StudentProvider } from './context/StudentContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <Router>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/cursos" element={
              <ProtectedRoute>
                <Materias />
              </ProtectedRoute>
            } />
            <Route path="/cursos/:cursoId" element={
              <ProtectedRoute>
                <Seleccion_Profesores />
              </ProtectedRoute>
            } />
            
            {/* Redirigir rutas no encontradas al login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;