// @ Front-Profesor-Recommendation-System
// @ File Name : ProfessorDetails.jsx
// @ Date : 12/05/2025
// @ Author : Alejandro Manuel Jerez Melgar 24678

/**
 * Componente ProfessorDetails
 * 
 * Este componente representa la página de detalles de un profesor específico.
 * Características principales:
 * - Muestra información detallada del profesor
 * - Permite editar la información (solo administradores)
 * - Muestra estadísticas y cursos asignados
 * - Implementa controles de acceso basados en rol
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfessor } from '../context/ProfessorContext';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/Header';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import ProfessorDetailCard from '../Components/Cards/ProfessorDetailCard';

const ProfessorDetails = () => {
  // ===== HOOKS Y ESTADOS =====
  const { professorId } = useParams(); // Obtiene el ID del profesor de la URL
  const { getProfessorById, loading } = useProfessor(); // Contexto de profesores
  const { isAdmin } = useAuth(); // Verificación de rol de administrador
  const navigate = useNavigate(); // Hook de navegación
  const [professor, setProfessor] = useState(null); // Estado para datos del profesor
  const [isEditing, setIsEditing] = useState(false); // Estado para modo de edición

  // ===== EFECTOS =====
  // Cargar datos del profesor según ID
  useEffect(() => {
    if (professorId) {
      const professorData = getProfessorById(professorId);
      setProfessor(professorData);
    }
  }, [professorId, getProfessorById]);

  // Verificar que el usuario es admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // ===== MANEJADORES DE EVENTOS =====
  // Manejar regreso a la lista de profesores
  const handleGoBack = () => {
    navigate('/admin/professors');
  };

  // Manejar modo de edición
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // ===== RENDERIZADO CONDICIONAL =====
  // Mostrar spinner de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===== RENDERIZADO DEL COMPONENTE =====
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          {/* Encabezado con navegación */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGoBack}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-teal-600">
                Detalle del Profesor
              </h1>
            </div>
            
            {/* Botones de acción */}
            <div className="flex space-x-3">
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isEditing 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isEditing ? 'Cancelar' : 'Editar Profesor'}
              </button>
              
              {isEditing && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-8">
            {/* Tarjeta de detalles del profesor */}
            <ProfessorDetailCard professor={professor} />
            
            {/* Sección de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Estadística: Cursos Activos */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Cursos Activos</h3>
                <p className="text-3xl font-bold">{professor?.courses?.length || 0}</p>
              </div>
              
              {/* Estadística: Estudiantes */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Estudiantes</h3>
                <p className="text-3xl font-bold">45</p>
              </div>
              
              {/* Estadística: Evaluación Promedio */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Evaluación Promedio</h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold mr-2">{professor?.rating || 0}</p>
                  <div className="flex mt-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Estadística: Años de Experiencia */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Años de Experiencia</h3>
                <p className="text-3xl font-bold">8</p>
              </div>
            </div>
            
            {/* Tabla de cursos asignados */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-teal-700">Cursos Asignados</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Curso</th>
                      <th scope="col" className="px-6 py-3">Sección</th>
                      <th scope="col" className="px-6 py-3">Horario</th>
                      <th scope="col" className="px-6 py-3">Estudiantes</th>
                      <th scope="col" className="px-6 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professor?.courses?.map((course, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{course}</td>
                        <td className="px-6 py-4">Sección {index + 1}</td>
                        <td className="px-6 py-4">Lun/Mie 10:00-11:30</td>
                        <td className="px-6 py-4">{15 + index}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetails;