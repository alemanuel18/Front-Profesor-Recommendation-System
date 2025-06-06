import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Materias from './pages/Materias';
import Seleccion_Profesores from './pages/Seleccion_Profesores';
import Login from './pages/Login';
import AdminEstudiantes from './pages/Admin/AdminEstudiantes';
import StudentDetails from './pages/StudentDetails';
import AdminProfessors from './pages/Admin/AdminProfessors';
import ProfessorDetails from './pages/ProfessorDetails';
import AdminCourses from './pages/Admin/AdminCourses';
import CoursesDetails from './pages/CoursesDetails';
import { StudentProvider } from './context/StudentContext';
import { AuthProvider } from './context/AuthContext';
import { ProfessorProvider } from './context/ProfessorContext';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminProtectedRoute from './Components/Admin/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <ProfessorProvider>
          <Router>
            <Routes>
              {/* Ruta pública */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas para estudiantes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/student-details" element={
                <ProtectedRoute>
                  <StudentDetails />
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
              
              {/* Rutas protegidas para administradores */}

              <Route path="/admin/estudiantes" element={
                <AdminProtectedRoute>
                  <AdminEstudiantes />
                </AdminProtectedRoute>
              } />

              <Route path="/admin/professors" element={
                <AdminProtectedRoute>
                  <AdminProfessors />
                </AdminProtectedRoute>
              } />

              <Route path="/admin/professors/:professorId" element={
                <AdminProtectedRoute>
                  <ProfessorDetails />
                </AdminProtectedRoute>
              } />

              <Route path="/admin/courses" element={
                <AdminProtectedRoute>
                  <AdminCourses />
                </AdminProtectedRoute>
              } />

              <Route path="/admin/courses/:courseId" element={
                <AdminProtectedRoute>
                  <CoursesDetails />
                </AdminProtectedRoute>
              } />
              
              {/* Redirigir rutas no encontradas al login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ProfessorProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;